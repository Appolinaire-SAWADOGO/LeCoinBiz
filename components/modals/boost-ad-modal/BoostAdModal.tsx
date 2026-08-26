import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import { useBoostPayment } from "@/hooks/services/boostAdPayment/useBoostAdPayment";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MoovMoneyLogo from "../../../assets/images/moov-money-logo.png";
import OrangeMoneyLogo from "../../../assets/images/orange-money-logo.png";
import AppFullModal from "../AppFullModal";
import AppDateTimePickerModal from "../date-time-picker-modal/AppDateTimePickerModal";

const PRICE_PER_DAY = 300;

const PACKS = [
  { id: "3d", days: 3, price: 900, badge: null },
  { id: "5d", days: 5, price: 1500, badge: null },
  { id: "7d", days: 7, price: 1900, originalPrice: 2100, badge: "Populaire" },
  {
    id: "30d",
    days: 30,
    price: 7500,
    originalPrice: 9000,
    badge: "Meilleure offre",
  },
] as const;

const MIN_CUSTOM_DAYS = 1;
const MAX_CUSTOM_DAYS = 60;

// ⚠️ Remplace ces numéros par tes vrais numéros Mobile Money marchand
const PAYMENT_METHODS = [
  {
    id: "orange",
    label: "Orange Money",
    image: OrangeMoneyLogo,
    color: "#FF6600",
    merchantNumber: "77976643",
  },
  {
    id: "moov",
    label: "Moov Money",
    image: MoovMoneyLogo,
    color: "#0072BC",
    merchantNumber: "63823210",
  },
] as const;

type Step = 1 | 2;
type PaymentPhase = "form" | "waiting" | "success";

export default function BoostAdModal({
  isOpen,
  onClose,
  onConfirm,
  ad,
}: {
  isOpen: boolean;
  onClose: () => void;
  ad: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  onConfirm?: (payload: {
    days: number;
    price: number;
    startDate: Date;
    paymentMethod: string;
    phoneNumber: string;
  }) => void;
}) {
  const { designSystem } = useAppTheme();

  const [step, setStep] = useState<Step>(1);

  // --- Étape 1 : formule + dates ---
  const [selectedPackId, setSelectedPackId] = useState<string>("7d");
  const [customDays, setCustomDays] = useState(10);
  const [startDate, setStartDate] = useState(() =>
    dayjs().add(1, "hour").toDate(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Dayjs | null>(null);

  // --- Étape 2 : déclaration de paiement ---
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("form");
  const [copied, setCopied] = useState(false);

  const { declareBoostPayment, subscribeToPaymentStatus, cancelSubscription } =
    useBoostPayment();

  // Coupe l'écoute si le modal se ferme pendant qu'on attend la validation
  React.useEffect(() => {
    return () => cancelSubscription();
  }, []);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethodId);

  const isCustom = selectedPackId === "custom";

  const { days, price } = useMemo(() => {
    if (isCustom) {
      const matchingPack = PACKS.find((p) => p.days === customDays);
      if (matchingPack) {
        return { days: matchingPack.days, price: matchingPack.price };
      }
      return { days: customDays, price: customDays * PRICE_PER_DAY };
    }
    const pack = PACKS.find((p) => p.id === selectedPackId);
    return { days: pack?.days ?? 0, price: pack?.price ?? 0 };
  }, [isCustom, customDays, selectedPackId]);

  const endDate = useMemo(() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + days);
    return d;
  }, [startDate, days]);

  const formatDate = (d: Date) => dayjs(d).format("DD MMM YYYY, HH:mm");

  const handleCustomDaysChange = (updater: (d: number) => number) => {
    setCustomDays((prev) => updater(prev));
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      setStartDate(tempDate.toDate());
      setShowDatePicker(false);
    }
  };

  const isPhoneValid = phoneNumber.replace(/\s/g, "").length === 8;
  const canSubmit = !!selectedMethodId && isPhoneValid;

  const handleGoToPayment = () => {
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
    setPhoneNumber("");
    setPaymentPhase("form");
    setCopied(false);
  };

  const handleCopyNumber = async () => {
    if (!selectedMethod) return;
    await Clipboard.setStringAsync(selectedMethod.merchantNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeclarePayment = async () => {
    if (!canSubmit || !selectedMethod || !selectedMethodId) return;

    setPaymentPhase("waiting");

    const paymentId = await declareBoostPayment({
      adId: ad.id,
      days,
      price,
      startDate,
      operator: selectedMethodId as "orange" | "moov",
      phoneNumber,
    });

    if (!paymentId) {
      // declareBoostPayment a déjà affiché le toast d'erreur
      setPaymentPhase("form");
      return;
    }

    subscribeToPaymentStatus(paymentId, {
      onCompleted: () => {
        setPaymentPhase("success");
        setTimeout(() => {
          onConfirm?.({
            days,
            price,
            startDate,
            paymentMethod: selectedMethodId,
            phoneNumber,
          });
          onClose();
        }, 900);
      },
      onFailed: () => {
        setPaymentPhase("form");
      },
    });
  };

  const handleModalClose = () => {
    setStep(1);
    setSelectedMethodId(null);
    setPhoneNumber("");
    setPaymentPhase("form");
    onClose();
  };

  return (
    <AppFullModal
      isOpen={isOpen}
      onClose={handleModalClose}
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <Container
        style={{ paddingHorizontal: 20 }}
        onBackPress={step === 2 ? handleBackToStep1 : handleModalClose}
      >
        <PageHeader
          onBack={step === 2 ? handleBackToStep1 : handleModalClose}
          name={step === 1 ? "Booster mon annonce" : "Paiement"}
        />

        {step === 1 && (
          <View style={styles.adPreview}>
            <Image
              source={{ uri: ad.imageUrl }}
              style={styles.adPreviewImage}
            />
            <View style={{ flex: 1 }}>
              <AppText fontSize={13} font="Medium" numberOfLines={1}>
                {ad.title}
              </AppText>
              <AppText
                fontSize={13}
                font="Bold"
                color={designSystem.colors.primary}
              >
                {ad.price.toLocaleString()} FCFA
              </AppText>
            </View>
          </View>
        )}

        {step === 1 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Formules */}
            <AppText font="Medium" style={styles.sectionTitle}>
              Choisir une formule
            </AppText>

            <View style={styles.packsGrid}>
              {PACKS.map((pack) => {
                const selected = selectedPackId === pack.id;
                return (
                  <TouchableOpacity
                    key={pack.id}
                    onPress={() => setSelectedPackId(pack.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.packCard,
                      selected && {
                        borderColor: designSystem.colors.primary,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    {pack.badge && (
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: designSystem.colors.primary },
                        ]}
                      >
                        <AppText fontSize={9} font="Bold" color="#fff">
                          {pack.badge}
                        </AppText>
                      </View>
                    )}
                    <AppText fontSize={15} font="Bold">
                      {pack.days} jours
                    </AppText>
                    <AppText
                      fontSize={18}
                      font="Bold"
                      color={designSystem.colors.primary}
                    >
                      {pack.price.toLocaleString()} FCFA
                    </AppText>
                    {"originalPrice" in pack && pack.originalPrice && (
                      <AppText fontSize={11} style={styles.strikethrough}>
                        {pack.originalPrice.toLocaleString()} FCFA
                      </AppText>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Pack personnalisé */}
              <TouchableOpacity
                onPress={() => setSelectedPackId("custom")}
                activeOpacity={0.8}
                style={[
                  styles.packCard,
                  styles.customCard,
                  isCustom && {
                    borderColor: designSystem.colors.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <AppText fontSize={15} font="Bold">
                  Personnalisé
                </AppText>
                <AppText fontSize={11} color={designSystem.colors.subText}>
                  {PRICE_PER_DAY} FCFA / jour
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Stepper si personnalisé */}
            {isCustom && (
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() =>
                    handleCustomDaysChange((d) =>
                      Math.max(MIN_CUSTOM_DAYS, d - 1),
                    )
                  }
                  style={styles.stepperButton}
                >
                  <MaterialCommunityIcons name="minus" size={20} />
                </TouchableOpacity>

                <AppText
                  fontSize={18}
                  font="Bold"
                  style={{ minWidth: 60, textAlign: "center" }}
                >
                  {customDays} j
                </AppText>

                <TouchableOpacity
                  onPress={() =>
                    handleCustomDaysChange((d) =>
                      Math.min(MAX_CUSTOM_DAYS, d + 1),
                    )
                  }
                  style={styles.stepperButton}
                >
                  <MaterialCommunityIcons name="plus" size={20} />
                </TouchableOpacity>
              </View>
            )}

            {/* Date de début */}
            <AppText font="Medium" style={styles.sectionTitle}>
              Date de début
            </AppText>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar-outline"
                size={18}
                color={designSystem.colors.primary}
              />
              <AppText fontSize={14}>{formatDate(startDate)}</AppText>
            </TouchableOpacity>

            {showDatePicker && (
              <AppDateTimePickerModal
                show={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                handleConfirm={handleDateConfirm}
                tempDate={tempDate}
                setTempDate={setTempDate}
                minDate={dayjs()}
                timePicker
              />
            )}

            {/* Résumé */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <AppText
                  fontSize={13}
                  color={designSystem.colors.subText}
                  style={styles.summaryLabel}
                >
                  Période
                </AppText>
                <AppText
                  fontSize={13}
                  font="Medium"
                  numberOfLines={2}
                  style={styles.summaryValue}
                >
                  {formatDate(startDate)} → {formatDate(endDate)}
                </AppText>
              </View>
              <View style={styles.summaryRow}>
                <AppText fontSize={13} color={designSystem.colors.subText}>
                  Durée
                </AppText>
                <AppText fontSize={13} font="Medium">
                  {days} jour{days > 1 ? "s" : ""}
                </AppText>
              </View>
              <View style={[styles.summaryRow, { marginTop: 4 }]}>
                <AppText fontSize={16} font="Bold">
                  Total
                </AppText>
                <AppText
                  fontSize={20}
                  font="Bold"
                  color={designSystem.colors.primary}
                >
                  {price.toLocaleString()} FCFA
                </AppText>
              </View>
            </View>

            {/* CTA vers étape 2 */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: designSystem.colors.primary },
              ]}
              onPress={handleGoToPayment}
              activeOpacity={0.85}
            >
              <AppText fontSize={15} font="Bold" color="#fff">
                Continuer vers le paiement
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        )}

        {step === 2 && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Rappel commande */}
              <View style={styles.orderRecap}>
                <AppText fontSize={13} color={designSystem.colors.subText}>
                  {days} jour{days > 1 ? "s" : ""} de boost
                </AppText>
                <AppText
                  fontSize={22}
                  font="Bold"
                  color={designSystem.colors.primary}
                >
                  {price.toLocaleString()} FCFA
                </AppText>
              </View>

              {/* --- Écran d'attente / succès --- */}
              {paymentPhase !== "form" && (
                <View style={styles.waitingBlock}>
                  {paymentPhase === "waiting" ? (
                    <>
                      <ActivityIndicator
                        size="large"
                        color={designSystem.colors.primary}
                      />
                      <AppText
                        font="Bold"
                        fontSize={15}
                        style={{ marginTop: 16, textAlign: "center" }}
                      >
                        Vérification en cours
                      </AppText>
                      <AppText
                        fontSize={13}
                        color={designSystem.colors.subText}
                        style={{ marginTop: 6, textAlign: "center" }}
                      >
                        Nous vérifions la réception de votre paiement. Cela
                        prend généralement quelques minutes.
                      </AppText>
                    </>
                  ) : (
                    <>
                      <View style={styles.successIconWrap}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={48}
                          color={designSystem.colors.primary}
                        />
                      </View>
                      <AppText
                        font="Bold"
                        fontSize={15}
                        style={{ marginTop: 16, textAlign: "center" }}
                      >
                        Paiement confirmé
                      </AppText>
                    </>
                  )}
                </View>
              )}

              {/* --- Formulaire de déclaration --- */}
              {paymentPhase === "form" && (
                <>
                  <AppText font="Medium" style={styles.sectionTitle}>
                    Moyen de paiement
                  </AppText>

                  <View style={styles.paymentMethodsRow}>
                    {PAYMENT_METHODS.map((method) => {
                      const selected = selectedMethodId === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          onPress={() => handleSelectMethod(method.id)}
                          activeOpacity={0.8}
                          style={[
                            styles.paymentMethodCard,
                            selected && {
                              borderColor: designSystem.colors.primary,
                            },
                          ]}
                        >
                          <Image
                            source={method.image}
                            style={[
                              styles.paymentMethodIcon,
                              { backgroundColor: method.color },
                            ]}
                          />
                          <AppText fontSize={13} font="Medium">
                            {method.label}
                          </AppText>
                          {selected && (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={18}
                              color={designSystem.colors.primary}
                              style={{ marginLeft: "auto" }}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Instructions de paiement manuel */}
                  {selectedMethod && (
                    <>
                      <View style={styles.payInstructions}>
                        <AppText fontSize={13} font="Medium">
                          Envoyez{" "}
                          <AppText
                            fontSize={13}
                            font="Bold"
                            color={designSystem.colors.primary}
                          >
                            {price.toLocaleString()} FCFA
                          </AppText>{" "}
                          via {selectedMethod.label} au numéro :
                        </AppText>

                        <TouchableOpacity
                          style={styles.merchantNumberRow}
                          onPress={handleCopyNumber}
                          activeOpacity={0.8}
                        >
                          <AppText fontSize={20} font="Bold">
                            {selectedMethod.merchantNumber}
                          </AppText>
                          <MaterialCommunityIcons
                            name={copied ? "check" : "content-copy"}
                            size={18}
                            color={designSystem.colors.primary}
                          />
                        </TouchableOpacity>

                        <AppText
                          fontSize={12}
                          color={designSystem.colors.subText}
                          style={{ marginTop: 6 }}
                        >
                          {copied
                            ? "Numéro copié !"
                            : "Appuyez pour copier le numéro"}
                        </AppText>
                      </View>

                      <AppText font="Medium" style={styles.sectionTitle}>
                        Numéro utilisé pour le paiement
                      </AppText>
                      <AppText
                        fontSize={12}
                        color={designSystem.colors.subText}
                        style={{ marginBottom: 10 }}
                      >
                        Le numéro depuis lequel vous avez envoyé l'argent —
                        nécessaire pour vérifier votre paiement
                      </AppText>

                      <View style={styles.inputRow}>
                        <AppText
                          fontSize={14}
                          color={designSystem.colors.subText}
                        >
                          +226
                        </AppText>
                        <TextInput
                          value={phoneNumber}
                          onChangeText={(t) =>
                            setPhoneNumber(t.replace(/[^0-9]/g, "").slice(0, 8))
                          }
                          placeholder="XX XX XX XX"
                          keyboardType="number-pad"
                          style={styles.textInput}
                          maxLength={8}
                        />
                      </View>
                    </>
                  )}
                </>
              )}

              {/* CTA déclaration */}
              {paymentPhase === "form" && (
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {
                      backgroundColor: canSubmit
                        ? designSystem.colors.primary
                        : designSystem.colors.primaryDisabled,
                    },
                  ]}
                  onPress={handleDeclarePayment}
                  activeOpacity={0.85}
                  disabled={!canSubmit}
                >
                  <AppText fontSize={15} font="Bold" color="#fff">
                    J'ai envoyé le paiement
                  </AppText>
                </TouchableOpacity>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Container>
    </AppFullModal>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  packsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  packCard: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  customCard: {
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  summaryCard: {
    backgroundColor: "#F7F7F9",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  summaryLabel: {
    flexShrink: 0,
  },
  summaryValue: {
    flex: 1,
    flexShrink: 1,
    textAlign: "right",
  },
  confirmButton: {
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  orderRecap: {
    alignItems: "center",
    backgroundColor: "#F7F7F9",
    borderRadius: 12,
    padding: 18,
    marginTop: 16,
    gap: 4,
  },
  paymentMethodsRow: {
    gap: 10,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 14,
  },
  paymentMethodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  payInstructions: {
    backgroundColor: "#F7F7F9",
    borderRadius: 12,
    padding: 16,
    marginTop: 14,
    alignItems: "center",
  },
  merchantNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  waitingBlock: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIconWrap: {
    marginTop: 4,
  },
  adPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 8,
  },
  adPreviewImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
});

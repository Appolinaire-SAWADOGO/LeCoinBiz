## BostAdModal version avec api integre

```
import Container from "@/components/Container";
import AppText from "@/components/custom/AppText";
import PageHeader from "@/components/PageHeader";
import { useBoostPayment } from "@/hooks/services/boostAdPayment/useBoostAdPayment";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
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

// Mode de validation propre à chaque opérateur (Burkina Faso, via LigdiCash)
// Orange : le client génère un OTP via USSD, on le collecte avec le numéro, 1 seule requête
// Moov : on collecte juste le numéro, l'opérateur envoie un push USSD à valider avec le code PIN
const PAYMENT_METHODS = [
  {
    id: "orange",
    label: "Orange Money",
    image: OrangeMoneyLogo,
    color: "#FF6600",
    validationMode: "otp_ussd" as const,
    ussdCode: "*144*4*6#",
  },
  {
    id: "moov",
    label: "Moov Money",
    image: MoovMoneyLogo,
    color: "#0072BC",
    validationMode: "ussd_push" as const,
  },
] as const;

const OTP_LENGTH = 6;

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

  // --- Étape 2 : paiement ---
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("form"); // form | waiting | succes

  const { createBoostPayment, subscribeToPaymentStatus, cancelSubscription } =
    useBoostPayment();

  // Coupe l'écoute si le modal se ferme pendant qu'on attend le paiement
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
  const isOtpValid = otpCode.length === OTP_LENGTH;

  // Orange nécessite l'OTP saisi manuellement (généré par USSD avant soumission)
  // Moov ne nécessite que le numéro, la validation se fait ensuite sur le téléphone
  const canSubmit =
    selectedMethod?.validationMode === "otp_ussd"
      ? isPhoneValid && isOtpValid
      : isPhoneValid;

  const handleGoToPayment = () => {
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
    setPhoneNumber("");
    setOtpCode("");
    setPaymentPhase("form");
  };

  const handleSubmitPayment = async () => {
    if (!canSubmit || !selectedMethod || !selectedMethodId) return;

    setPaymentPhase("waiting");

    const paymentId = await createBoostPayment({
      adId: ad.id,
      days,
      price,
      startDate,
      operator: selectedMethodId as "orange" | "moov",
      phoneNumber,
      otpCode:
        selectedMethod.validationMode === "otp_ussd" ? otpCode : undefined,
    });

    if (!paymentId) {
      // createBoostPayment a déjà affiché le toast d'erreur
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
    setOtpCode("");
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

              {/* --- Écran d'attente / succès (Moov push ou après soumission Orange) --- */}
              {paymentPhase !== "form" && selectedMethod && (
                <View style={styles.waitingBlock}>
                  {paymentPhase === "waiting" ? (
                    <>
                      <ActivityIndicator
                        size="large"
                        color={designSystem.colors.primary}
                      />
                      {selectedMethod.validationMode === "ussd_push" ? (
                        <>
                          <AppText
                            font="Bold"
                            fontSize={15}
                            style={{ marginTop: 16, textAlign: "center" }}
                          >
                            Validez sur votre téléphone
                          </AppText>
                          <AppText
                            fontSize={13}
                            color={designSystem.colors.subText}
                            style={{ marginTop: 6, textAlign: "center" }}
                          >
                            Un message est apparu sur votre téléphone. Entrez
                            votre code PIN Moov Money pour confirmer le
                            paiement.
                          </AppText>
                        </>
                      ) : (
                        <AppText
                          font="Bold"
                          fontSize={15}
                          style={{ marginTop: 16, textAlign: "center" }}
                        >
                          Confirmation du paiement en cours…
                        </AppText>
                      )}
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

              {/* --- Formulaire (choix opérateur + saisie) --- */}
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

                  {/* --- Flux Orange : instructions USSD + numéro + OTP --- */}
                  {selectedMethod?.validationMode === "otp_ussd" && (
                    <>
                      <View style={styles.ussdInstructions}>
                        <MaterialCommunityIcons
                          name="information-outline"
                          size={18}
                          // color={designSystem.colors.subText}
                        />
                        <View style={{ flex: 1 }}>
                          <AppText fontSize={13} font="Medium">
                            Composez{" "}
                            <AppText fontSize={13} font="Bold">
                              {selectedMethod.ussdCode}
                            </AppText>{" "}
                            sur votre téléphone
                          </AppText>
                          <AppText
                            fontSize={12}
                            color={designSystem.colors.subText}
                            style={{ marginTop: 2 }}
                          >
                            Un code s'affiche à l'écran. Saisissez-le ci-dessous
                            avant qu'il n'expire.
                          </AppText>
                        </View>
                      </View>

                      <AppText font="Medium" style={styles.sectionTitle}>
                        Numéro {selectedMethod.label}
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

                      <AppText font="Medium" style={styles.sectionTitle}>
                        Code reçu à l'écran
                      </AppText>

                      <View style={styles.inputRow}>
                        <MaterialCommunityIcons
                          name="dialpad"
                          size={18}
                          color={designSystem.colors.subText}
                        />
                        <TextInput
                          value={otpCode}
                          onChangeText={(t) =>
                            setOtpCode(
                              t.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH),
                            )
                          }
                          placeholder={"•".repeat(OTP_LENGTH)}
                          keyboardType="number-pad"
                          style={[styles.textInput, { letterSpacing: 4 }]}
                          maxLength={OTP_LENGTH}
                        />
                      </View>
                    </>
                  )}

                  {/* --- Flux Moov : juste le numéro --- */}
                  {selectedMethod?.validationMode === "ussd_push" && (
                    <>
                      <AppText font="Medium" style={styles.sectionTitle}>
                        Numéro {selectedMethod.label}
                      </AppText>
                      <AppText
                        fontSize={12}
                        color={designSystem.colors.subText}
                        style={{ marginBottom: 10 }}
                      >
                        Vous recevrez une demande de validation directement sur
                        votre téléphone
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

              {/* CTA paiement */}
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
                  onPress={handleSubmitPayment}
                  activeOpacity={0.85}
                  disabled={!canSubmit}
                >
                  <AppText fontSize={15} font="Bold" color="#fff">
                    Payer {price.toLocaleString()} FCFA
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
  ussdInstructions: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F7F7F9",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
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
```

## useBoostAdPayment avec api integre

```
import { modifyAdToQueryData, showToast } from "@/utils";
import { firebaseFirestore, firebaseFunctions } from "@/utils/firebase";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

type Operator = "orange" | "moov";

type CreateBoostPaymentParams = {
  adId: string;
  days: number;
  price: number;
  startDate: Date;
  operator: Operator;
  phoneNumber: string;
  otpCode?: string;
};

type BoostPaymentStatus = "pending" | "completed" | "failed";

export const useBoostPayment = () => {
  const queryClient = useQueryClient();

  // On garde la fonction de désabonnement Firestore ici, pour pouvoir
  // couper l'écoute si le composant se démonte ou si on relance un paiement
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Étape 1 : crée le paiement côté backend (appel à la Cloud Function
   * "createBoostPayment"), qui elle-même appelle LigdiCash et retourne
   * un paymentId. Cette étape ne dit PAS si le paiement a réussi —
   * elle dit juste "la demande a été envoyée à l'opérateur".
   */
  const createBoostPayment = async (
    params: CreateBoostPaymentParams,
  ): Promise<string | null> => {
    try {
      const createBoostPaymentFunction =
        firebaseFunctions.httpsCallable("createBoostPayment");

      const result = await createBoostPaymentFunction({
        adId: params.adId,
        days: params.days,
        price: params.price,
        startDate: params.startDate.toISOString(),
        operator: params.operator,
        phoneNumber: params.phoneNumber,
        otpCode: params.otpCode,
      });

      const { paymentId } = result.data as { paymentId: string; token: any };
      return paymentId;
    } catch (error: any) {
      console.error("Erreur lors de la création du paiement :", error);

      if (error.code === "unauthenticated") {
        showToast("error", "Vous devez être connecté.");
      } else if (error.code === "invalid-argument") {
        showToast("error", "Informations de paiement invalides.");
      } else if (error.code === "aborted") {
        // Erreur renvoyée par LigdiCash elle-même (ex: numéro invalide)
        showToast("error", error.message || "Le paiement a été refusé.");
      } else {
        showToast("error", "Une erreur est survenue.");
      }
      return null;
    }
  };

  /**
   * Étape 2 : "écoute" le document Firestore boostPayments/{paymentId}.
   *
   * Pourquoi c'est nécessaire : après l'étape 1, LigdiCash traite le
   * paiement en arrière-plan (le client valide sur son téléphone via
   * OTP ou push USSD). LigdiCash nous prévient du résultat final via
   * une requête qu'elle envoie à NOTRE Cloud Function "ligdicashCallback"
   * (pas à l'app directement — l'app ne peut pas recevoir de requête).
   *
   * "ligdicashCallback" met alors à jour le champ `status` du document
   * Firestore. Ce hook, lui, se contente d'ÉCOUTER ce document — dès que
   * le champ `status` change (grâce à onSnapshot, qui réagit en temps réel
   * à tout changement Firestore), on déclenche onCompleted ou onFailed.
   *
   * Schéma résumé :
   * App (créé le paiement) → LigdiCash (traite) → LigdiCash appelle
   * ligdicashCallback (notre backend) → ligdicashCallback met à jour
   * Firestore → onSnapshot ici détecte le changement → on informe l'UI
   */
  const subscribeToPaymentStatus = (
    paymentId: string,
    callbacks: {
      onCompleted: () => void;
      onFailed: () => void;
    },
  ) => {
    // On coupe une éventuelle écoute précédente avant d'en démarrer une nouvelle
    unsubscribeRef.current?.();

    const paymentRef = doc(firebaseFirestore, "boostPayments", paymentId);

    const unsubscribe = onSnapshot(
      paymentRef,
      (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        const status = data.status as BoostPaymentStatus;

        if (status === "completed") {
          // Met à jour le cache React Query pour que l'UI (badge "Boosté")
          // se mette à jour immédiatement sans refetch
          modifyAdToQueryData(
            ["ad", data.adId],
            { isBoosted: true },
            queryClient,
          );

          callbacks.onCompleted();
          unsubscribeRef.current?.();
        } else if (status === "failed") {
          showToast("error", "Le paiement a échoué. Réessayez.");
          callbacks.onFailed();
          unsubscribeRef.current?.();
        }
        // Si status === "pending", on ne fait rien : on continue d'attendre
      },
      (error) => {
        console.error("Erreur d'écoute du paiement :", error);
        showToast("error", "Impossible de vérifier le statut du paiement.");
        callbacks.onFailed();
      },
    );

    unsubscribeRef.current = unsubscribe;
  };

  /**
   * À appeler quand le modal se ferme ou que le composant se démonte,
   * pour éviter une écoute Firestore qui tourne dans le vide.
   */
  const cancelSubscription = () => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  };

  return { createBoostPayment, subscribeToPaymentStatus, cancelSubscription };
};
```

### createBoostPayment avec api integre

```
import * as functions from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

const LIGDICASH_CREATE_URL =
  "https://app.ligdicash.com/pay/v01/straight/checkout-invoice/create";

const OPERATORS = {
  orange: { operatorId: "11", prefix: "22670" },
  moov: { operatorId: "12", prefix: "226" },
} as const;

type OperatorKey = keyof typeof OPERATORS;

function formatPhoneForOperator(rawPhone: string) {
  const digitsOnly = rawPhone.replace(/[^0-9]/g, "");
  // digitsOnly attendu : 8 chiffres saisis côté app (ex: 70000000)
  return `226${digitsOnly}`;
}

export const createBoostPayment = onCall(
  {
    consumeAppCheckToken: false,
    region: "europe-southwest1",
    secrets: [
      "LIGDICASH_API_KEY",
      "LIGDICASH_API_TOKEN",
      "LIGDICASH_CALLBACK_URL",
    ],
  },
  async (request) => {
    try {
      if (!request.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "Utilisateur non authentifié.",
        );
      }

      const { adId, days, price, startDate, operator, phoneNumber } =
        request.data as {
          adId: string;
          days: number;
          price: number;
          startDate: string;
          operator: OperatorKey;
          phoneNumber: string;
        };

      if (!adId || !days || !price || !operator || !phoneNumber) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Champs manquants pour créer le paiement.",
        );
      }

      if (!OPERATORS[operator]) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Opérateur invalide.",
        );
      }

      const userId = request.auth.uid;
      const formattedPhone = formatPhoneForOperator(phoneNumber);
      const transactionId = `BOOST-${adId}-${Date.now()}`;

      const paymentRef = db.collection("BoostPayments").doc();
      await paymentRef.set({
        adId,
        userId,
        days,
        price,
        startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
        operatorId: OPERATORS[operator].operatorId,
        phoneNumber,
        formattedPhone,
        status: "pending",
        token: null,
        transactionId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();

      const response = await fetch(LIGDICASH_CREATE_URL, {
        method: "POST",
        headers: {
          Apikey: process.env.LIGDICASH_API_KEY!,
          Authorization: `Bearer ${process.env.LIGDICASH_API_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commande: {
            invoice: {
              items: [],
              total_amount: price,
              devise: "XOF",
              description: `Boost annonce ${adId} — ${days} jours`,
              customer: formattedPhone,
              customer_firstname: userData?.firstName ?? "Client",
              customer_lastname: userData?.lastName ?? "LeCoinBiz",
              customer_email: userData?.email ?? "",
              external_id: paymentRef.id,
              otp: operator === "orange" ? (request.data.otpCode ?? "") : "",
            },
            store: {
              name: "LeCoinBiz",
              website_url: "https://lecoinbiz-e43b7.web.app",
            },
            actions: {
              cancel_url: "",
              return_url: "",
              callback_url: process.env.LIGDICASH_CALLBACK_URL,
            },
            custom_data: {
              payment_id: paymentRef.id,
              transaction_id: transactionId,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.response_code !== "00") {
        await paymentRef.update({
          status: "failed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        throw new functions.https.HttpsError(
          "aborted",
          result.response_text || "Échec de la création du paiement.",
        );
      }

      await paymentRef.update({
        token: result.token,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { paymentId: paymentRef.id, token: result.token };
    } catch (error: any) {
      console.error("Erreur lors de la communication avec LigdiCash. :", error);
      throw new HttpsError("internal", error.message);
    }
  },
);

```

## ligdicashcallback

```
import { onRequest } from "firebase-functions/v2/https";
import { admin, db } from "../../firebase";

export const ligdicashCallback = onRequest(
  {
    region: "europe-southwest1",
    invoker: "public",
  },
  async (req, res) => {
    try {
      // LigdiCash envoie 2 requêtes (form-urlencoded puis JSON) — on traite les deux,
      // mais l'idempotency check ci-dessous évite le double traitement
      const event = req.body;

      const token = event.token;
      const status = event.status; // "completed" | "pending" | "nocompleted"

      if (!token) {
        res.status(400).json({ status: "error", message: "token manquant" });
        return;
      }

      const paymentsSnap = await db
        .collection("BoostPayments")
        .where("token", "==", token)
        .limit(1)
        .get();

      if (paymentsSnap.empty) {
        res
          .status(404)
          .json({ status: "error", message: "paiement introuvable" });
        return;
      }

      const paymentDoc = paymentsSnap.docs[0];
      const paymentData = paymentDoc.data();

      if (paymentData.status === "completed") {
        res.status(200).json({ status: "success", message: "déjà traité" });
        return;
      }

      if (status === "completed") {
        const batch = db.batch();

        batch.update(paymentDoc.ref, {
          status: "completed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const adRef = db.collection("Ads").doc(paymentData.adId);
        const boostExpiredAt = admin.firestore.Timestamp.fromDate(
          new Date(
            paymentData.startDate.toDate().getTime() +
              paymentData.days * 24 * 60 * 60 * 1000,
          ),
        );

        batch.update(adRef, {
          isBoosted: true,
          boostStartAt: paymentData.startDate,
          boostExpiredAt,
        });

        await batch.commit();
      } else if (status === "nocompleted" || status === "failed") {
        await paymentDoc.ref.update({
          status: "failed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      res.status(200).json({ status: "success" });
    } catch (error: any) {
      console.error("Erreur ligdicashCallback :", error?.message);
      res.status(500).json({ success: false, error: error?.message });
    }
  },
);

```

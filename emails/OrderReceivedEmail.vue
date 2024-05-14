<script setup lang="ts">
import {
  EHr,
  EHtml,
  EText,
  EPreview,
  EContainer,
  ESection,
  EHead,
  EImg,
  ERow,
  EColumn,
} from "vue-email";
import { type ShippingAddress } from "@/types";

interface Props {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
  baseUrl: string;
}

const { shippingAddress, orderId, orderDate, baseUrl } = defineProps<Props>();

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  },
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    color: "#000",
  },
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
};

const adressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  },
};
</script>

<template>
  <EHtml lang="en">
    <EHead>
      <title>Email title</title>
      <meta name="description" content="Description" />
    </EHead>
    <EPreview>Your order summary and estimated delivery date</EPreview>
    <EContainer :style="container">
      <ESection :style="message">
        <EImg
          :src="`${baseUrl}/snake-3.png`"
          width="65"
          height="73"
          alt="delivery snake"
          :style="{ margin: 'auto' }"
        />
        <e-heading :style="global.heading" as="h2">
          Thank you for your order!</e-heading
        >

        <EText :style="global.text">
          We're preparing everything for delivery and will notify you once your
          package has been shipped. Delivery usually takes 2 days.
        </EText>
        <EText :style="{ ...global.text, marginTop: 24 }">
          If you have any questions regarding your order, please feel free to
          contact us with your order number and we're here to help.
        </EText>
      </ESection>
      <EHr :style="global.hr" />
      <ESection :style="global.defaultPadding">
        <EText :style="adressTitle"
          >Shipping to: {{ shippingAddress.name }}</EText
        >
        <EText :style="{ ...global.text, fontSize: 14 }">
          {{ shippingAddress.street }}, {{ shippingAddress.city }},{' '}
          {{ shippingAddress.state }} {{ shippingAddress.postalCode }}
        </EText>
      </ESection>
      <EHr :style="global.hr" />
      <ESection :style="global.defaultPadding">
        <ERow :style="{ display: 'inline-flex gap-16', marginBottom: 40 }">
          <EColumn :style="{ width: 170 }">
            <EText :style="global.paragraphWithBold">Order Number</EText>
            <EText :style="track.number">{{ orderId }}</EText>
          </EColumn>
          <EColumn :style="{ marginLeft: 20 }">
            <EText :style="global.paragraphWithBold">Order Date</EText>
            <EText :style="track.number">{{ orderDate }}</EText>
          </EColumn>
        </ERow>
      </ESection>

      <EHr :style="global.hr" />

      <ESection :style="paddingY">
        <ERow>
          <EText
            :style="{
              ...footer.text,
              paddingTop: 30,
              paddingBottom: 30,
            }"
          >
            Please contact us if you have any questions. (If you reply to this
            email, we won't be able to see it.)
          </EText>
        </ERow>
        <ERow>
          <EText :style="footer.text">
            © CaseCobra, Inc. All Rights Reserved.
          </EText>
        </ERow>
      </ESection>
    </EContainer>
  </EHtml>
</template>

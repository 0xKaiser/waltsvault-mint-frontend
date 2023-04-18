import axios from "axios";

const BASE_URL = "https://waltsvaultmint.0xytocin.online";

export const getOrderSignature = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL + "/signer/order", { address: address });
    return data;
  } catch (err) {
    return false;
  }
};

export const getRefundSignature = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL + "/signer/refund", { address: address });
    return data;
  } catch (err) {
    return false;
  }
};
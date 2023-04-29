import axios from "axios";

const BASE_URL = "https://seahorse-app-dpo4n.ondigitalocean.app/signer/";

export const getOrderSignature = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL + "order", { address: address });
    return data;
  } catch (err) {
    return false;
  }
};

export const getRefundSignature = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL + "refund", { address: address });
    return data;
  } catch (err) {
    return false;
  }
};

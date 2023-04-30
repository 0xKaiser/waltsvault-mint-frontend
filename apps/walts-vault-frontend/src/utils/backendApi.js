import axios from "axios";

const BASE_URL = "https://waltsvault-be-new-jfmdh.ondigitalocean.app/signer/unique";

export const getOrderSignature = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL, { address: address });
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

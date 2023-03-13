import React, { useEffect, useState } from "react";
import { showError, showSuccess } from "../../utility/other";

const useFetchData = ({
  apiFunction,
  apiParams,
  apiCallCondition,
  dependencyArray,
  successCallBack,
  errorCallBack,
  showErrorMessage,
  showSuccessMessage,
  errorMessage,
  successMessage,
}) => {
  const [state, setState] = useState({
    isLoading: false,
    data: [],
  });
  const { isLoading, data } = state;
  console.log("🚀 ~ file: useFetchData.js:21 ~ isLoading:", isLoading)
  useEffect(() => {
    if (apiCallCondition) {
      console.log("🚀 ~ file: useFetchData.js:24 ~ useEffect ~ apiCallCondition:", apiCallCondition)
      setState({
        ...state,
        isLoading: true,
      });
      apiFunction(apiParams)
        .then((res) => {
          console.log("🚀 ~ file: useFetchData.js:29 ~ .then ~ res:", res)
          if (res?.status === 200 || res?.status === 204) {
            if (res?.data?.success === false) {
              setState({
                ...state,
                isLoading: false,
                data: [],
              });
              showErrorMessage && showError(res?.data || errorMessage);
              errorCallBack && errorCallBack(res?.data);
              return;
            }
            setState({
              ...state,
              isLoading: true,
              data: res?.data,
            });
            successCallBack && successCallBack(res?.data);
            showSuccessMessage &&
              showSuccess(successMessage || res?.data);
          } else {
            setState({
              ...state,
              isLoading: false,
              data: [],
            });
            showErrorMessage && showError(res?.data || errorMessage);
          }
        })
        .catch((error) => {
          setState({
            ...state,
            isLoading: false,
            data: [],
          });
          showErrorMessage && showError(error || errorMessage);
          errorCallBack && errorCallBack(error);
        });
    }
  }, dependencyArray);
  return [{ isLoading, data }];
};

export default useFetchData;

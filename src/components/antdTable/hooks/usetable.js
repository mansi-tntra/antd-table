import { message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveTableColumn,
  saveTableRows,
} from "../../../redux/table/tableActions";
import useFetchData from "../../hooks/useFetchData";

const useTable = (props) => {
  const { form, getApiCall, rowReduxKey, columnReduxKey } = props;

  const [state, setState] = useState({
    rowData: [],
    columnData: [],
    body: {},
    editRowKey: "",
  });
  const { rowData, columnData, body, editRowKey } = state;
  const [triggerList, setTriggerList] = useState(false);
  
  const { dataSource } = useSelector((state) => ({
    dataSource: state?.table?.[rowReduxKey],
  }));

  const dispatch = useDispatch();

  const isEditing = (record) => {
    return record.key === editRowKey;
  };
  const listSuccess = (data) => {
    console.log("🚀 ~ file: usetable.js:17 ~ listSuccess ~ data:", data);
    const modifiedData =  data.map(({body , ...item})=>({
      ...item,
      key: item?.id,
      message: body
    }))
    setState({
      ...state,
      rowData: [...modifiedData],
      body: {
        ...body,
      },
    });
    const colArray = [];
    for (let [key, value] of Object.entries(modifiedData[0])) {
      console.log(key, "mansi" , value);
      colArray.push({
        title: String(key).charAt(0).toUpperCase() + String(key).slice(1),
        dataIndex: key,
        key: key,
        name: key,
        editable: true,
      });
      console.log("colArray", colArray);
    }
    setTriggerList(false);
    dispatch(saveTableRows(rowReduxKey, [...modifiedData]));
    dispatch(saveTableColumn(columnReduxKey, [...colArray]));
    setState({
      ...state,
      columnData: [...colArray],
    });
  };
  const listError = () => {};

  const [{ isLoading: isListLoading }] = useFetchData({
    apiFunction: getApiCall,
    apiParams: body,
    apiCallCondition: triggerList,
    dependencyArray: [triggerList],
    successCallBack: listSuccess,
    errorCallBack: listError,
  });

  const handleEdit = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      message: "",
      ...record,
    });

    setState({
      ...state,
      editRowKey: record.key,
    });
  };

  const handleSave =async (key) => {
    console.log("record" , key)
    try {
        const row = await form.validateFields();
        const newData = [...dataSource];
        console.log("🚀 ~ file: usetable.js:90 ~ handleSave ~ rowData:", dataSource)
        console.log("🚀 ~ file: usetable.js:88 ~ handleSave ~ newData:", newData)
        console.log("KKKK" , newData.findIndex((item)=>console.log(item.key===key ,"KKKK")))
        const index = newData.findIndex((item) => key === item.key);
        console.log("idex", index);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row
          });
         setState({
           ...state,
            rowData: newData,
            editRowKey:""

         })
         dispatch(saveTableRows(rowReduxKey,[...newData]))
        } else {
          newData.push(row);
          setState({
            ...state,
            rowData:newData,
            editRowKey:""
          })
          dispatch(saveTableRows(rowReduxKey,[...newData]))
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    
  };

  const handleCancel = () => {
    setState({
        ...state,
        editRowKey: "",
      });
  };
  return [
    {
      isListLoading,
      rowData,
      columnData,
      body,
      editRowKey,
      isEditing,
      handleEdit,
      handleSave,
      handleCancel,
    },
  ];
};

export default useTable;

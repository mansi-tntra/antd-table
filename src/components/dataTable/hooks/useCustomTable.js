import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  saveTableColumn,
  saveTableRows,
} from "../../../redux/table/tableActions";
import useFetchData from "../../hooks/useFetchData";

const useCustomTable = (props) => {
  const { form, getApiCall, rowReduxKey, columnReduxKey, hasActions } = props;
  const [state, setState] = useState({
    rowData: [],
    column: [],
    pagination: {},
    body: {},
    editRowKey: "",
    searchText: "",
  });
  const [triggerList, setTriggerList] = useState(false);
  const { rowData, column, pagination, body, editRowKey, searchText } = state;
  const dispatch = useDispatch();

  const handleDelete = (value) => {
    const record = [...rowData];
    console.log(
      "🚀 ~ file: customTable.js:56 ~ handleDelete ~ record:",
      record
    );
    const deletedData = record.filter((item) => item?.id !== value?.id);
    console.log(
      "🚀 ~ file: customTable.js:59 ~ handleDelete ~ deletedData:",
      deletedData
    );
    dispatch(saveTableRows(rowReduxKey, [...deletedData]));
  };

  const isEditing = (record) => {
    return record?.id === editRowKey;
  };

  const handleSave = () => {};
  const handleEdit = (record) => {
    console.log("record", record);
    form.setFieldValue({
      name: "",
      email: "",
      message: "",
      ...record,
    });
    setState({
      ...state,
      editRowKey: record?.id,
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      editRowKey: "",
    });
  };

  const listSuccess = (data, pagination) => {
    console.log("🚀 ~ file: useCustomTable.js:18 ~ listSuccess ~ data:", data);
    const colArray = [];
    setState({
      ...state,
      rowData: data,
      pagination: pagination,
    });
    setTriggerList(false);
    dispatch(saveTableRows(rowReduxKey, [...data]));
    const Objectvalue = Object.entries(data[0]);
    console.log(
      "🚀 ~ file: useCustomTable.js:28 ~ listSuccess ~ Objectvalue:",
      Objectvalue
    );
    for (let [key, value] of Object.entries(data[0])) {
      console.log(key, "mansi");
      colArray.push({
        title: String(key).charAt(0).toUpperCase() + String(key).slice(1),
        dataIndex: key,
        key: key,
        name: key,
        editable: true,
      });
      console.log("colArray", colArray);
    }
    // const Action = {
    //   title: "Actions",
    //   dataIndex: "action",
    //   name: "action",
    //   render: (_, record) => {
    //     return (
    //       <Space>
    //         <Popconfirm
    //           title="Are you sure want to Delete?"
    //           onConfirm={() => handleDelete(record)}
    //         >
    //           <Button danger type="primary">
    //             <DeleteOutlined />
    //           </Button>
    //         </Popconfirm>
    //       </Space>
    //     );
    //   },
    // };
    dispatch(saveTableColumn(columnReduxKey, [...colArray]));
    setState({
      ...state,
      rowData: data,
      column: colArray,
      body: {
        ...body,
      },
    });
  };
  const handleChange = (...sorter) => {
    console.log(sorter, "sorter");
    let setOrder;
    let sort_by;
    if (sorter?.[2]?.order === "ascend") {
      setOrder = "ascend";
      sort_by = sorter?.[2]?.columnKey;
    }
    if (sorter?.[2]?.order === "descend") {
      setOrder = "descend";
      sort_by = sorter?.[2]?.columnKey;
    }
    console.log("body", body);
    setState({
      ...state,
      body: {
        ...body,
        sort_by: sort_by,
        sort_order: setOrder,
      },
    });
  };
  const listError = () => {
    setTriggerList(false);
  };
  const handleInputChange = (e) => {
    setState({
      ...state,
      searchText: e.target.value,
    });
    if (e.target.value === "") {
      setTriggerList(true);
    }
  };
  const handleSearch = () => {
    const filterData = rowData.filter((value) => {
      return value.name.toLowerCase().includes(searchText.toLowerCase());
    });
    console.log(
      "🚀 ~ file: useCustomTable.js:133 ~ filterData ~ filterData:",
      filterData
    );
    dispatch(saveTableRows(rowReduxKey, [...filterData]));
    setState({
      ...state,
      rowData: filterData,
    });
  };

  // const addActionColumn = () => {
  //   const Action = {
  //     title: "Actions",
  //     dataIndex: "action",
  //   };
  //   setState({
  //     ...state,
  //     column: [...column, Action],
  //   });
  // };
  const [{ isLoading: isListLoading }] = useFetchData({
    apiFunction: getApiCall,
    apiParams: { ...body },
    apiCallCondition: [triggerList],
    dependencyArray: [triggerList],
    successCallBack: listSuccess,
    errorCallBack: listError,
  });
  return [
    {
      isListLoading,
      rowData,
      body,
      searchText,
      handleDelete,
      isEditing,
      handleSave,
      handleCancel,
      handleEdit,
      handleChange,
      handleSearch,
      handleInputChange,
    },
  ];
};

export default useCustomTable;

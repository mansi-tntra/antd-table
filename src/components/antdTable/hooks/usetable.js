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
    selectRowKeys: [],
    selectedRows:[]
  });
  const { rowData, columnData, body, editRowKey, selectRowKeys , selectedRows} = state;
  const [triggerList, setTriggerList] = useState(false);

  const { dataSource } = useSelector((state) => ({
    dataSource: state?.table?.[rowReduxKey],
  }));

  const dispatch = useDispatch();

  const isEditing = (record) => {
    return record.id === editRowKey;
  };
  const listSuccess = (data) => {
    console.log("🚀 ~ file: usetable.js:17 ~ listSuccess ~ data:", data);
    const modifiedData = data.map(({ body, ...item }) => ({
      ...item,
      // id: id,
      // message: body,
    }));
    setState({
      ...state,
      rowData: [...modifiedData],
      body: {
        ...body,
      },
    });
    const colArray = [];
    for (let [key, value] of Object.entries(modifiedData[0])) {
      console.log(key, "mansi", value);
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
      editRowKey: record.id,
    });
  };

  const handleSave = async (key) => {
    console.log("record", key);
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      console.log(
        "🚀 ~ file: usetable.js:90 ~ handleSave ~ rowData:",
        dataSource
      );
      console.log("🚀 ~ file: usetable.js:88 ~ handleSave ~ newData:", newData);
      console.log(
        "KKKK",
        newData.findIndex((item) => console.log(item.key === key, "KKKK"))
      );
      const index = newData.findIndex((item) => key === item.id);
      console.log("idex", index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setState({
          ...state,
          rowData: newData,
          editRowKey: "",
        });
        dispatch(saveTableRows(rowReduxKey, [...newData]));
      } else {
        newData.push(row);
        setState({
          ...state,
          rowData: newData,
          editRowKey: "",
        });
        dispatch(saveTableRows(rowReduxKey, [...newData]));
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

  const handleTableChange = (pagination, filter, sorter) => {
    console.log(
      "🚀 ~ file: usetable.js:145 ~ handleTableChange ~ sorter:",
      sorter,
      pagination
    );
    let sortOrder;
    let sortBy;
  
  
    let desData = [];
    if (sorter?.order !== undefined) {
      if (sorter?.order === "ascend") {
        sortOrder = "ascend";
        sortBy = sorter?.columnKey;
        let ascData = [];
        console.log(
          "🚀 ~ file: usetable.js:154 ~ handleTableChange ~ sortBy:",
          sortBy
        );
        const newData = [...dataSource];
        if (sortBy === "name") {
          ascData = newData.sort((a, b) => a.name.length - b.name.length);
          setState({
            ...state,
            rowData: ascData,
          });
        }
        if (sortBy == "id") {
          ascData = newData.sort((a, b) => a.id - b.id);
          setState({
            ...state,
            rowData: ascData,
          });
        }
        console.log("sortData", ascData, dataSource);
        
        dispatch(saveTableRows(rowReduxKey, [...ascData]));
      }
      if (sorter?.order === "descend") {
        sortOrder = "descend";
        sortBy = sorter?.columnKey;
        console.log(
          "🚀 ~ file: usetable.js:168 ~ handleTableChange ~ sortBy:",
          sortBy
        );
        if (sortBy === "name") {
          desData = dataSource.reverse(
            (a, b) => a.name?.length - b.name.length
          );
          setState({
            ...state,
            rowData: desData,
          });
        }
        if (sortBy === "id") {
          desData = dataSource.reverse((a, b) => a.id - b.id);
          setState({
            ...state,
            rowData: desData,
          });
        }
        
        dispatch(saveTableRows(rowReduxKey, [...desData]));
      }
    }
    // dispatch(saveTableRows(rowReduxKey, [...dataSource]))
    setState({
      ...state,
      body: {
        ...body,
        page: pagination.current,
        per_page: pagination.pageSize,
        total_entries: pagination.total,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });
  };
  const handleSorting = (item, sortOrder) => {
    console.log(
      "🚀 ~ file: table.js:82 ~ handleSorting ~ item:",
      item,
      sortOrder
    );
  };
const onSelectChange =(newSelectedRowKeys , selectedRows) => {
  console.log("🚀 ~ file: usetable.js:228 ~ onSelectChange ~ selectedRows:", selectedRows, newSelectedRowKeys)

  setState({
    ...state,
    selectRowKeys: newSelectedRowKeys,
    selectedRows: selectedRows
  })

}
  const rowSelection ={
    selectRowKeys,
    onChange: onSelectChange 
  }
  const handleDelete=()=>{
    console.log("🚀 ~ file: usetable.js:228 ~ onSelectChange ~ selectedRows:", selectedRows[0]?.id, selectRowKeys)
    const record =[...dataSource];
    const DeleteData = record.filter((item)=> item?.id !== selectedRows[0]?.id );
    console.log("🚀 ~ file: usetable.js:245 ~ handleDelete ~ DeleteData:", DeleteData)
    setState({
      ...state,
      rowData: DeleteData,

    })
    dispatch(saveTableRows(rowReduxKey,[...DeleteData]))
  }
  return [
    {
      isListLoading,
      rowData,
      columnData,
      body,
      editRowKey,
      rowSelection,
      isEditing,
      handleEdit,
      handleSave,
      handleCancel,
      handleSorting,
      handleTableChange,
      handleDelete
    },
  ];
};

export default useTable;

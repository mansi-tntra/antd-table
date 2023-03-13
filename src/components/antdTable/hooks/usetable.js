import { EllipsisOutlined, FilterOutlined } from "@ant-design/icons";
import { Button, Checkbox, Dropdown, message } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveTableColumn,
  saveTableRows,
} from "../../../redux/table/tableActions";
import CustomDropdown from "../../CustomDropdown/dropDown";
import useFetchData from "../../hooks/useFetchData";

const useTable = (props) => {
  const { form, getApiCall, rowReduxKey, columnReduxKey, hasHideShow } = props;

  const [state, setState] = useState({
    rowData: [],
    columnData: [],
    body: {},
    editRowKey: "",
    selectRowKeys: [],
    selectedRows: [],
  });
  const { rowData, columnData, body, editRowKey, selectRowKeys, selectedRows } =
    state;
  const [triggerList, setTriggerList] = useState(false);

  const { dataSource } = useSelector((state) => ({
    dataSource: state?.table?.[rowReduxKey],
  }));
  const { column } = useSelector((state) => ({
    column: state?.table?.[columnReduxKey],
  }));
  console.log(
    "🚀 ~ file: usetable.js:31 ~ const{column}=useSelector ~ column:",
    column
  );
  const dispatch = useDispatch();
  const [hideShowData, setHideShowData] = useState(column);
  console.log(
    "🚀 ~ file: usetable.js:39 ~ useTable ~ hideShowData:",
    hideShowData
  );
  const isEditing = (record) => {
    return record.id === editRowKey;
  };

  const getColumnProps = (dataIndex) => ({
    filterDropdown: ({}) => {
      const items = [
        {
          key: "1",
          label: "Hide/show",
          children: hideShowData?.map((col) => {
            console.log("CCC", col);
            return {
              key: col.dataIndex,
              name: col.name,
              label: (
                <Checkbox
                  onChange={(event) =>
                    handelHideShow(col, event.target.checked)
                  }
                  checked={col?.visibility}
                  disabled={col.fixed === true}
                >
                  {col.title}
                </Checkbox>
              ),
            };
          }),
        },
      ];
      const handelHideShow = (data, event) => {
        console.log("AAAA", data);
        const filterData = column.map((element) => {
          console.log("EEE", element);
          return {
            ...element,
            ...getColumnProps(element?.dataIndex),
          };
        });
        const findIndex = filterData.findIndex(
          (element) => element.name === data.name
        );

        filterData[findIndex].visibility = false;
        setState({
          ...state,
          columnData: [...filterData],
        });
          setHideShowData(filterData)
        console.log(
          "🚀 ~ file: usetable.js:277 ~ handelHideShow ~ findIndex:",
          findIndex
        );
        console.log(
          "🚀 ~ file: usetable.js:274 ~ filterData ~ filterData:",
          filterData
        );
      };
      return (
        <div
          style={{
            padding: 8,
          }}
        >
          {hasHideShow && (
            <CustomDropdown
              items={items}
              trigger={["click"]}
              className="moreOptions"
              triggerSubMenuAction="click"
              dropdownIndicator={<EllipsisOutlined />}
            />
          )}
        </div>
      );
    },
    filterIcon: () => <FilterOutlined />,
    onFilter: (value, record) =>
      record[dataIndex].toString().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      console.log("VVVV", visible);
    },
  });
  const listSuccess = (data) => {
    setTriggerList(true)
    console.log("🚀 ~ file: usetable.js:17 ~ listSuccess ~ data:", data);
    // setTriggerList(true)
    const modifiedData = data.map(({ body, ...item }) => ({
      ...item,
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
        visibility: true,
        fixed: false,
        width: 80,
      });
      console.log("colArray", colArray);
    }
    dispatch(saveTableRows(rowReduxKey, [...modifiedData]));
    dispatch(saveTableColumn(columnReduxKey, [...colArray]));
    setState({
      ...state,
      columnData: [...colArray],
    });
    setTriggerList(false);
  };
  const listError = () => {};

  

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
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log(
      "🚀 ~ file: usetable.js:228 ~ onSelectChange ~ selectedRows:",
      selectedRows,
      newSelectedRowKeys
    );

    setState({
      ...state,
      selectRowKeys: newSelectedRowKeys,
      selectedRows: selectedRows,
    });
  };
  const rowSelection = {
    selectRowKeys,
    onChange: onSelectChange,
  };
  const handleDelete = () => {
    console.log(
      "🚀 ~ file: usetable.js:228 ~ onSelectChange ~ selectedRows:",
      selectedRows[0]?.id,
      selectRowKeys
    );
    const record = [...dataSource];
    const DeleteData = record.filter(
      (item) => item?.id !== selectedRows[0]?.id
    );
    console.log(
      "🚀 ~ file: usetable.js:245 ~ handleDelete ~ DeleteData:",
      DeleteData
    );
    setState({
      ...state,
      rowData: DeleteData,
    });
    dispatch(saveTableRows(rowReduxKey, [...DeleteData]));
  };

  const [{ isLoading: isListLoading }] = useFetchData({
    apiFunction: getApiCall,
    apiParams: body,
    apiCallCondition: [triggerList],
    dependencyArray: [triggerList],
    successCallBack: listSuccess,
    errorCallBack: listError,
  });

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
      handleDelete,
    },
  ];
};

export default useTable;

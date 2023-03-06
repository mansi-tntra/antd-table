import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import axios from "axios";
import { isEmpty } from "loadsh";
import React, { useEffect, useState } from "react";

const editableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  console.log("editable", editing);
  const input = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
            },
          ]}
        >
          {input}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export const DataTable = (props) => {
  const [from] = Form.useForm();
  const { hasAction, hasDeleteAction } = props || {};
  const [state, setState] = useState({
    columnData: [],
    dataSource: [],
    editRowKey: "",
    loading: false,
  });
  const { columnData, dataSource, loading, editRowKey } = state;

  const renderData = async () => {
    const res = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    setState({
      ...state,
      dataSource: res.data,
      loading: false,
    });
  };

  useEffect(() => {
    renderData();
  }, []);

  const isEditing = (record) => {
    console.log("🚀 ~ file: dataTable.js:63 ~ isEditing ~ record:", record);
    return record.key === editRowKey;
  };

  const save = async (key) => {
    try {
      const row = await from.validateFields();
      console.log("🚀 ~ file: dataTable.js:78 ~ save ~ row:", row);
      const newData = [...modifiedData];
      const index = newData.findIndex((item) => key === item.key);
      console.log("🚀 ~ file: dataTable.js:81 ~ save ~ index:", index);
      if (index > -1) {
        const item = newData[index];
        console.log("🚀 ~ file: dataTable.js:84 ~ save ~ item:", item)
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setState({
          ...state,
          dataSource: newData,
          editRowKey: "",
        });
      } else {
        newData.push(row);
        setState({
          ...state,
          dataSource: newData,
          editRowKey: "",
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: dataTable.js:103 ~ save ~ error:", error);
    }
    
  };

  const edit = (record) => {
    console.log("🚀 ~ file: dataTable.js:39 ~ edit ~ record:", record.key);
    from.setFieldsValue({
      name: "",
      email: "",
      message: "",
      ...record,
    });
    setState({
      ...state,
      editRowKey: record.key,
    });
    console.log("editrowkey", editRowKey);
  };

  const cancel = () => {
    setState({
      ...state,
      editRowKey: "",
    });
  };

  const modifiedData = dataSource.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    message: isEmpty(body) ? item.message : body,
  }));

  const handleDelete = (value) => {
    console.log("value", value);
    const record = [...modifiedData];
    const DeleteData = record.filter((item) => item.id !== value.id);
    setState({
      ...state,
      dataSource: DeleteData,
      columnData: column,
    });
  };

  const column = [
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editable: true,
    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      render: (_, record) => {
        const editing = isEditing(record);
        console.log(
          "🚀 ~ file: dataTable.js:131 ~ DataTable ~ editing:",
          editing
        );
        return editing ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editRowKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const modifiedColumn = column.map((col) => {
    // console.log("column" , col)
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  console.log(modifiedColumn, "mmmmmmmmmmmmmmm");

  const handleChange = (...sorter) => {
    console.log(sorter, "sorter");
  };

  return (
    <div>
      <Form form={from} component={false}>
        <Table
          components={{
            body: {
              cell: editableCell,
            },
          }}
          columns={modifiedColumn}
          dataSource={modifiedData}
          bordered
          loading={loading}
          onChange={handleChange}
        ></Table>
      </Form>
    </div>
  );
};

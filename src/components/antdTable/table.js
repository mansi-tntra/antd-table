import { Col, Space, Table, Typography, Popconfirm, Form, Input } from "antd";
import Column from "antd/es/table/Column";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useTable from "./hooks/usetable";
import { isEmpty } from "loadsh";
import { saveTableRows } from "../../redux/table/tableActions";

const editableCell = (props) => {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  } = props;
  const inputNode =  <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const AntTable = (props) => {
  const [form] = Form.useForm();
  const { getApiCall, rowReduxKey, columnReduxKey } = props;
  const [
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
  ] = useTable({
    form,
    getApiCall,
    columnReduxKey,
    rowReduxKey,
  });

  const { column } = useSelector((state) => ({
    column: state?.table?.[columnReduxKey],
  }));
  console.log("column", column);
  const { dataSource } = useSelector((state) => ({
    dataSource: state?.table?.[rowReduxKey],
  }));
  const mergeColumn = () => {
    const data = [];
    if (Array.isArray(column)) {
      data.push(...column);
    }
    console.log("mmmm", data);
    return data;
  };
  const handle = (item) =>
    // console.log("item", item);
    item.map((item) => {
      console.log("item", item);
      return (
        <Column
          key={item?.key}
          title={item?.title}
          dataIndex={item?.dataIndex}
          editable={item?.editable}
          render={(value) => {
            return <span> {String(value)}</span>;
          }}
          onCell={(record) => ({
            record,
            dataIndex: item.dataIndex,
            title: item.title,
            editing: isEditing(record),
          })}
        />
      );
    });

  const modifiedData = dataSource.map(({ ...item }) => ({
    ...item,
    key: item.id,
  }));
let component ={
    body:{
        cell : editableCell
    },
}

  return (
    <Form form={form} component={false}>
      <Table components={component} dataSource={modifiedData} >
        {handle(mergeColumn())}
        {console.log(
          "🚀 ~ file: table.js:70 ~ AntTable ~ handle(mergeColumn()):",
          handle(mergeColumn())
        )}

        {
          <Column
            title="Actions"
            dataIndex="actions"
            width={80}
            key="actions"
            fixed={"right"}
            visible={true}
            render={(_, record) => {
              const editing = isEditing(record);
              console.log(
                "🚀 ~ file: table.js:58 ~ AntTable ~ editing:",
                editing
              );
              return editing ? (
                <span>
                  <Typography.Link
                    onClick={() => handleSave(record.key)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Typography.Link
                  disabled={editRowKey !== ""}
                  onClick={() => handleEdit(record)}
                >
                  Edit
                </Typography.Link>
              );
            }}
          ></Column>
        }
      </Table>
    </Form>
  );
};

export default AntTable;

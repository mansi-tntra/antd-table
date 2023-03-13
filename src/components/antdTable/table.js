import {
  Col,
  Space,
  Table,
  Typography,
  Popconfirm,
  Form,
  Input,
  Button,
  Dropdown,
  Checkbox,
} from "antd";
import Column from "antd/es/table/Column";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useTable from "./hooks/usetable";
import { isEmpty } from "loadsh";
import { saveTableColumn, saveTableRows } from "../../redux/table/tableActions";
import "./table.css";
import {
  EllipsisOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import CustomDropdown from "../CustomDropdown/dropDown";
import { Resizable } from "react-resizable";
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
  const inputNode = <Input />;
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

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  console.log("🚀 ~ file: table.js:65 ~ ResizableTitle ~ width:", width);
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
const AntTable = (props) => {
  const [form] = Form.useForm();
  const {
    getApiCall,
    rowReduxKey,
    columnReduxKey,
    hasDeleteAction,
    pageSizeOptions,
    hasHideShow,
    scrollX,
  } = props;
  const [
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
      handleResize,
      // handelHideShow,
    },
  ] = useTable({
    form,
    getApiCall,
    columnReduxKey,
    rowReduxKey,
    hasHideShow,
  });

  const { column } = useSelector((state) => ({
    column: state?.table?.[columnReduxKey],
  }));
  console.log("column", column);
  const { dataSource } = useSelector((state) => ({
    dataSource: state?.table?.[rowReduxKey],
  }));
  const dispatch = useDispatch();
  const handelHideShow = (data, event) => {
    console.log("AAAA", data);
    const filterData = column.map((element) => {
      console.log("EEE", element);
      return {
        ...element,
      };
    });
    const findIndex = filterData.findIndex(
      (element) => element.name === data.name
    );

    filterData[findIndex].visibility = false;
    dispatch(saveTableColumn(columnReduxKey, [...filterData]));

    console.log(
      "🚀 ~ file: usetable.js:277 ~ handelHideShow ~ findIndex:",
      findIndex
    );
    console.log(
      "🚀 ~ file: usetable.js:274 ~ filterData ~ filterData:",
      filterData
    );
  };

  let components = {
    header: {
      cell: ResizableTitle,
    },
    body: {
      cell: editableCell,
    },
  };

  const items = [
    {
      key: "1",
      label: "Hide/show",
      children: column?.map((col) => {
        console.log("CCC", col);
        return {
          key: col.dataIndex,
          name: col.name,
          label: (
            <Checkbox
              onChange={(event) => handelHideShow(col, event.target.checked)}
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
  const getColumnProps = (dataIndex) => ({
    filterDropdown: ({}) => (
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
    ),
    filterIcon: () => <FilterOutlined />,
  });
  const mergeColumn = () => {
    const data = [];
    if (Array.isArray(column)) {
      column.forEach((col) => {
        if (col?.visibility === true) {
          console.log("KKK", col);
          data.push({
            ...col,
          });
        }
      });
      // dispatch(saveTableColumn(columnReduxKey, [data]));
    }

    console.log("mmmm", data);
    return data;
  };

  const handle = (item) =>
    item.map((item, index) => {
      console.log("item", item);
      return (
        <Column
          key={item?.dataIndex}
          title={item?.title}
          dataIndex={item?.dataIndex}
          editable={item?.editable}
          visibility={item?.visibility}
          width={item?.width}
          fixed={item?.fixed}
          resizable={item?.resizable}
          render={(value) => {
            return <span> {String(value)}</span>;
          }}
          
          onCell={(record) => ({
            record,
            dataIndex: item.dataIndex,
            title: item.title,
            editing: isEditing(record),
          })}
          onHeaderCell={(col) => ({
            width: col.width,
            onResize: handleResize(index),
          })}
          sorter={
            item?.dataIndex === "id" || item?.dataIndex === "name"
              ? true
              : false
          }
          {...getColumnProps(item?.dataIndex)}
        />
      );
    });

  // const items = [
  //   {
  //     key: "1",
  //     label: "Hide/show",
  //     children: column?.map((col) => {
  //       console.log("CCC", col);
  //       return {
  //         key: col.dataIndex,
  //         name: col.name,
  //         label: (
  //           <Checkbox
  //             onChange={(event) => handelHideShow(col, event.target.checked)}
  //             checked={col.visibility}
  //             disabled={col.fixed === true}
  //           >
  //             {col.title}
  //           </Checkbox>
  //         ),
  //       };
  //     }),
  //   },
  // ];
  return (
    <Form form={form} component={false}>
      {hasDeleteAction && (
        <Popconfirm title="confirm Cancel?" onConfirm={() => handleDelete()}>
          <Button danger type="primary">
            Delete
          </Button>
        </Popconfirm>
      )}
      {/* {hasHideShow && (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button>
            <span>
              <EllipsisOutlined />
            </span>
          </Button>
        </Dropdown>
      )} */}
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        components={components}
        dataSource={dataSource}
        
        // bordered={true}
        pagination={{
          pageSizeOptions,
          position: ["bottomRight"],
        }}
        onChange={handleTableChange}
        scroll={{
          x: "calc(100vh - 250px)",
          y: 500,
        }}
      >
        {handle(mergeColumn())}

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
              return editing ? (
                <span>
                  <Typography.Link
                    onClick={() => handleSave(record.id)}
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

import { Button, Form, Input, InputNumber, Popconfirm, Space, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import useCustomTable from "./hooks/useCustomTable";
import Column from "antd/es/table/Column";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { saveTableRows } from "../../redux/table/tableActions";
export const CustomTable = (props) => {
  const [form] = Form.useForm();
  const {
    getApiCall,
    rowReduxKey,
    columnReduxKey,
    paginationOptions,
    hasActions,
    hasDeleteAction,
    hasEditAction,
    hasSearch,
    hasColumnSearch,
  } = props;

  const [
    {
      isListLoading,
      body,
      searchText,
      handleDelete,
      isEditing,
      handleSave,
      handleCancel,
      handleEdit,
      handleChange,
      handleSearch,
      handleInputChange
    },
  ] = useCustomTable({
    form,
    getApiCall,
    columnReduxKey,
    rowReduxKey,
    hasActions
  });
  const { columnData } = useSelector((state) => ({
   
    columnData: state?.table?.[columnReduxKey],
  }));
  console.log("🚀 ~ file: customTable.js:43 ~ const{columnData}=useSelector ~ columnData:", columnData)
  const { rowData } = useSelector((state) => ({
    rowData: state?.table?.[rowReduxKey],
  }));
  const modifiedData = columnData.map((col)=>{
    console.log("col",col)
    if(!col?.editable){
      return col
    }
    return{
      ...col,
      onCell : (record)=> ({
        record,
        inputType: col?.dataIndex=== "id" ? "number" : "text",
        dataIndex: col?.dataIndex,
        title: col?.title,
        editing : isEditing(record)
      })
    }
  })
  const mergeColum = () => {
    let data = [];
    if (Array.isArray(columnData)) {
      console.log(
        modifiedData,
        "columnData"
      );
      data.push(...columnData);
    }
    console.log("HERE", data);
    return data;
  };
  const handleSorting = (item) => {
    console.log("III", item);
    if (item?.dataIndex) {
    }
  };
  const handleClick = () => {
    console.log("CLICK");
  };
  
  const handler = (item) =>
    item &&
    item?.length > 0 &&
    item?.map((item, index) => {
      console.log("item", item);
      return (
        <Column
          key={item?.dataIndex}
          title={item?.title}
          dataIndex={item?.dataIndex}
          editable={item?.editable}
        
          sortDirections={["ascend", "descend", "ascend"]}
          // sorter={(a,b) => {
          //   console.log('AAAA',a,b);
          // }}
          sorter={(a, b) => a?.dataIndex - b?.dataIndex}
          // sortOrder ={}
          // defaultSortOrder={`${body?.sort_order}`}
          // sortOrder={`${body?.sort_order}`}
          // sorter={()=>handleSorting(item)}
          render={(value) => {
            return <span> {String(value)}</span>;
          }}
        />
      );
    });

  const editableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    index,
    record,
    ...restProps
  }) => {
    const input = inputType === "number" ? <InputNumber/> : <Input/> ;
    console.log("MMMM", editing , dataIndex , title ,children,index , record )
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )
        }
      </td>
    );
  };

  // const editableCell =()=>{
  //   console.log("mansi")
  // }

  return (
    <div>
      <Form form={form} component={false}>
        {hasSearch && (
          <>
          <Input
            placeholder="Enter search here"
            onChange={handleInputChange}
            type="text"
            allowClear
            value={searchText}
          />
          <Button onClick={handleSearch} type="primary">Search</Button>
          </>
        )}
        <Table
          rowKey="id"
          bordered
          components={{
            body:{
              cell: editableCell
            }
          }}
          // columns={columnData}
          dataSource={rowData}
          onChange={handleChange}
          
        >
          <Column title="a"> hhh</Column>
          {handler(mergeColum())}
          {/* {console.log(handler(mergeColum()), "handler(mergeColum())")} */}
          {hasActions && (
            <Column
              title={"Actions"}
              key={"action"}
              width={80}
              fixed={"right"}
              visible={true}
    
              render={(_, record) => (
                <Space>
                  {hasDeleteAction && (
                    <Popconfirm
                      title="Are you sure want to Delete?"
                      onConfirm={() => handleDelete(record)}
                    >
                      <Button
                        danger
                        type="primary"
                        disabled={isEditing(record)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  )}
                  {hasEditAction && (
                    <span>
                      {isEditing(record) ? (
                        <Space size="middle">
                          <Button
                            onClick={() => handleSave(record.id)}
                            type="primary"
                          >
                            Save
                          </Button>
                          <Popconfirm
                            title="Are you sure want to Delete?"
                            onConfirm={handleCancel}
                          >
                            <Button>Cancel</Button>
                          </Popconfirm>
                        </Space>
                      ) : (
                        <Button
                          type="primary"
                          onClick={() => handleEdit(record)}
                        >
                          <EditOutlined />
                        </Button>
                      )}
                    </span>
                  )}
                </Space>
              )}
            ></Column>
          )}
        </Table>
      </Form>
    </div>
  );
};

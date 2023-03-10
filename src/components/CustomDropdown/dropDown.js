import React from "react";
import { Dropdown } from "antd";

const CustomDropdown = (props) => {
  const {
    trigger,
    disabled,
    className,
    items,
    triggerSubMenuAction,
    placement,
    handelOpenchange,
    dropdownOpen,
    arrow,
    dropdownIndicator,
  } = props;
  return (
    <Dropdown
      className={className}
      disabled={disabled}
      menu={{ items, triggerSubMenuAction}}
      placement={placement}
      trigger={trigger}
      autoFocus={true}
      arrow={arrow}
      // open={dropdownOpen}
      // onOpenChange={handelOpenchange}
    >
      {dropdownIndicator}
    </Dropdown>
  );
};

export default CustomDropdown;
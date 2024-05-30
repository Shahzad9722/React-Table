import React, { useEffect, useState } from "react";
import Table from "../component/Table";
import EmployeeModal from "./EmployeeModal";
import { Button, Toast, ToastBody, ToastHeader } from 'reactstrap';

const LOCAL_STORAGE_KEY = "employees";

export default function TestComponent() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [employee, setEmployee] = useState({ id: '', name: '', username: '', role: '', dateOfJoin: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setData(storedData);
  };

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  };

  const toggle = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedData = data.map(emp => (emp.id === employee.id ? employee : emp));
      saveData(updatedData);
      showToast('Employee updated successfully!');
      setIsEditing(false);
    } else {
      const newEmployee = { ...employee, id: Date.now() };
      saveData([...data, newEmployee]);
      showToast('Employee added successfully!');
    }
    setEmployee({ id: '', name: '', username: '', role: '', dateOfJoin: '' });
    toggle();
  };

  const handleTableButtonClick = (item, type) => {
    if (type === "Edit") {
      setEmployee(item);
      setIsEditing(true);
      toggle();
    } else if (type === "Delete") {
      const updatedData = data.filter(emp => emp.id !== item.id);
      saveData(updatedData);
    }
  };

  const handleAddClick = () => {
    setEmployee({ id: '', name: '', username: '', role: '', dateOfJoin: '' });
    setIsEditing(false);
    toggle();
  };
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };
  return (
    <div className="">
      <div className="d-flex justify-content-between p-3">
        <h3 className="">List of employees</h3>
        <Button color="primary" onClick={handleAddClick} className="mb-3">Add Employee</Button>

      </div>
      {data.length > 0 ? (
        <Table
          primaryKeyField={"id"}
          data={data}
          listItemToDisplay={[
            { name: "Id", valueField: "id" },
            { name: "Employee Name", valueField: "name" },
            { name: "Username", valueField: "username" },
            { name: "Role", valueField: "role" },
            { name: "Date of Join", valueField: "dateOfJoin" },
          ]}
          buttonsToDisplay={[
            { name: "Edit", imgClass: "td-edit-btn" },
            { name: "Delete", imgClass: "td-delete-btn" },
          ]}
          onTableButtonClick={handleTableButtonClick}
        />
      ) : (
        <div className="empty-list-msg">There is no data available to show</div>
      )}

      <EmployeeModal
        isOpen={modal}
        toggle={toggle}
        employee={employee}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />
      <div className="p-3 my-2 rounded" style={{ position: 'fixed', top: '30px', right: '30px' }}>
        <Toast isOpen={toast.visible}>
          <ToastHeader icon="success">Notification</ToastHeader>
          <ToastBody>{toast.message}</ToastBody>
        </Toast>
      </div>
    </div>
  );
}

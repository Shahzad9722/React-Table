import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';

const EmployeeModal = ({ isOpen, toggle, employee, handleInputChange, handleSubmit, isEditing }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{isEditing ? 'Edit Employee' : 'Add Employee'}</ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Employee Name</Label>
                        <Input type="text" name="name" id="name" value={employee.name} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" value={employee.username} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="role">Role</Label>
                        <Input type="text" name="role" id="role" value={employee.role} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="dateOfJoin">Date of Join</Label>
                        <Input type="date" name="dateOfJoin" id="dateOfJoin" value={employee.dateOfJoin} onChange={handleInputChange} required />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit">{isEditing ? 'Update' : 'Add'}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default EmployeeModal;

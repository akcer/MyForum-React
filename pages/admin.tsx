import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import AdminSectionsTab from '../components/AdminSectionsTab';
const Admin = () => {
  return (
    <div>
      <Tabs defaultActiveKey="section" id="admin-tab" className="mb-3">
        <Tab
          eventKey="section"
          title="Sections"
          tabClassName="bg-light text-dark"
        >
          <AdminSectionsTab />
        </Tab>
        <Tab
          eventKey="users"
          title="Users"
          tabClassName="bg-light text-dark"
        ></Tab>
        <Tab
          eventKey="liked"
          title="Liked Posts"
          tabClassName="bg-light text-dark"
        ></Tab>
      </Tabs>
    </div>
  );
};

export default Admin;

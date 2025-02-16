import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <Drawer variant="permanent" anchor="left">
            <List>
                <ListItem button component={Link} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/leads">
                    <ListItemText primary="Leads" />
                </ListItem>
                <ListItem button component={Link} to="/customers">
                    <ListItemText primary="Customers" />
                </ListItem>
                <ListItem button component={Link} to="/tasks">
                    <ListItemText primary="Tasks" />
                </ListItem>
                <ListItem button component={Link} to="/support">
                    <ListItemText primary="Support" />
                </ListItem>
                <ListItem button component={Link} to="/settings">
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;

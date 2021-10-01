import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { NavLink } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    toggleList: {
        marginLeft: "2rem",
    },
    toggleListItem: {
        padding: "3px 1rem",
    }
});

const ToggleListMenu = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClick = (event) => {
        if(open == true) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };
// onClick={handleClick}
// style={{ display: open ? 'none' : '' }}
    return (
        <nav>
            <ListItem button component={NavLink} to={"/designs/category/" + props.id}>
                <ListItemText primary={props.name} />
            </ListItem>
            <List className={classes.toggleList}>
                {props.categories.map((category, index) =>
                    <ListItem button className={classes.toggleListItem} component={NavLink} to={"/designs/category/" + category.id}>
                        <ListItemText primary={category.name} />
                    </ListItem>
                )}
            </List>
        </nav>
    );
}

export default ToggleListMenu

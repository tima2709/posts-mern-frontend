import React from 'react';
import SideBlock from "./SideBlock";
import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton} from "@mui/material";

const CommentsBlock = ({ items, children, isLoading = true }) => {
    return (
        <SideBlock title="Комментарии">
            <List>
                {(isLoading ? [...Array(5)] : items).map((obj, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {isLoading ? (
                                    <Skeleton variant="circular" width={40} height={40}/>
                                ) : (
                                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl}/>
                                )}
                            </ListItemAvatar>
                            {isLoading ? (
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <Skeleton variant="text" height={25} width={120}/>
                                    <Skeleton variant="text" height={18} width={230}/>
                                </div>
                            ) : (
                                <ListItemText
                                    primary={obj.user.fullName}
                                    secondary={obj.title}
                                />
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li"/>
                    </React.Fragment>
                ))}
            </List>
            {children}
        </SideBlock>
    );
};

export default CommentsBlock;
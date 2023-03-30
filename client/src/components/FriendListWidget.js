import { Box, Typography, useTheme } from "@mui/material"
import { setFriends } from "store"
import Friend from "./Friend"
import WidgetWrapper from "./WidgetWrapper"
import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect } from "react"

export default function FriendListWidget({ userId }) {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector(state => state.token);
    const friends = useSelector(state => state.user.friends);

    const getFriends = useCallback(async () => {
        const response = await fetch(`http://192.168.0.125:3001/users/${userId}/friends`,{
            method: "GET",
            headers: { Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    }, [userId, token, dispatch]);

    useEffect(() => {
        getFriends();
    }, [getFriends]);

    return (
        <WidgetWrapper>
            <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.map((friend, index) => (
                    <Friend key={index} friendId={friend._id} name={`${friend.firstName} ${friend.lastName}`} subtitle={friend.occupation} userPicturePath={friend.picturePath} />
                ))}
            </Box>
        </WidgetWrapper>
    )
}

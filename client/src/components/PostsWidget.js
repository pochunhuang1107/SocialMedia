import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "store";
import PostWidget from "./PostWidget";

export default function PostsWidget({ userId, isProfile = false }) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const posts = useSelector(state => state.posts);
    const sortedPosts = [...posts].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    const getPosts = useCallback(async () => {
        const response = await fetch('http://192.168.0.125:3001/posts',{
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    }, [dispatch, token]);

    const getUserPosts = useCallback(async () => {
        const response = await fetch(`http://192.168.0.125:3001/posts/${userId}/posts`,{
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    }, [dispatch, userId, token]);

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, [getUserPosts, getPosts, isProfile]);

    return (
        <>
            {sortedPosts.map(({_id, userId, firstName, lastName, description, location, picturePath, userPicturePath, likes, comments}) => {
                return <PostWidget key={_id} postId={_id} postUserId={userId} name={`${firstName} ${lastName}`} description={description} location={location} picturePath={picturePath} userPicturePath={userPicturePath} likes={likes} comments={comments} />
            })}
        </>
    )
}

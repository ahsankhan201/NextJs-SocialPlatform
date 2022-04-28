import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from "react";
import { Link } from 'components';
import { userService, alertService } from 'services';

export { AddEdit };


function AddEdit(props) {
    const [follower, setFollower] = useState (0)
    const [likes, setLikes] = useState (0)
    const [isFollow, setIsFollowing] = useState (false)
    const [isLike, setIsLike] = useState (false)
    const user = props?.user;
    var userId = userService.userValue.data.user._id
    const isAddMode = !user;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : null)
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (!isAddMode) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { formState } = useForm(formOptions);

    function likeUser() {
        return userService.likeUser(user.result.user._id, userId)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    function followUser() {
        return userService.followUser(user.result.user._id, userId)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        userService.getUserDetails(user.result.user._id)
            .then((x) => {
                setFollower(x.result.followers.length)
                setLikes(x.result.likes.length)
                setIsFollowing(x.result.followers.find((f) =>
                    f.follower_id === userId
                ) ? true : false)
                setIsLike(x.result.likes.find((f) =>
                    f.user_id === userId
                ) ? true : false)
            })
            .catch(alertService.error)
    }, []);

    return (
        <div className="form-group">
            <button onClick={likeUser} className="btn btn-primary mr-2" style={user.result.user._id == userId ? { display: 'none' } : { display: 'initial' }}>

                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                {isLike ? "unlike" : "like"}
            </button>
            <button onClick={followUser} type="button" disabled={isFollow} className="btn btn-secondary" style={user.result.user._id == userId ? { display: 'none' } : { display: 'initial' }}> {isFollow ? "following" : "Follow"}</button>
            <Link href="/users" className="btn btn-link">Cancel</Link>
            <div>
                <span>{follower} {follower > 1?'Followers':'Follower'}</span><br></br>
                <span>{likes} {likes > 1?'Likes':'Like'}</span>
            </div>
        </div>
    );
}
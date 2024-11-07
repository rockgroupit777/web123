import {userQueries,userMutations,userSubscriptions} from './user';
import {postQueries,postMutations,postSubscriptions} from './post';
const resolvers = {
    userQueries,
    postQueries,
    userMutations,
    postMutations,
    userSubscriptions,
    postSubscriptions

};

export {resolvers}

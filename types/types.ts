
export type StackParamList = {
    SignIn: undefined;
    Splash: undefined;
    SignUp: undefined;
    Home: undefined;
    AddRecipe: undefined;
    ChefDetail: RecipeListTypes;
    ModifyPost: { post_id: string };
    Lank: undefined;
    MartView: RecipeListTypes;
    EditProfile: undefined;
    MyPost: undefined;
    AboutDevelover: undefined;
};

export type TodayFoodTypes = {
    id: number,
    cuisine: string,
    name: string
}

export type BottomParamList = {
    Main: undefined,
    Search: undefined,
    Chef: undefined,
    Liked: undefined,
    Setting: undefined
}


export interface RouteProps {
    key: string;
    name: string;
    params: Params;
    path: any;
}

export interface Params {
    __v: number;
    _id: string;
    createdAt: Date;
    created_user: UserResultTypes;
    ingredient: string[];
    likes: any[];
    post_id: string;
    post_image: string;
    post_name: string;
    recipe: string[];
    updatedAt: Date;
}

export interface JoinUserTypes {
    nickName: string,
    date_created: number,
    join_time: string,
    uid: string,
    user_name: string
}

export interface UserResultTypes {
    __v: number,
    _id: string,
    createdAt: string,
    nick_name: string,
    uid: string,
    updatedAt: string,
    user_active: boolean,
    user_id: string,
    user_name: string
}

export interface RecipeListTypes {
    __v: number,
    _id: string,
    createdAt: string,
    subscription: string,
    created_user: UserResultTypes,
    ingredient: string[],
    likes: UserResultTypes[],
    post_id: string,
    post_image: string,
    post_name: string,
    recipe: string[],
    updatedAt: string
}
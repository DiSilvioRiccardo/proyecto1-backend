export function formatUser(user){
    user.password = "*******";
    delete user.__v;
    return user;
}
export interface UserPrivate{
    id: string
    username: string
    image_file: string | null
    image_path: string
    email: string
}

export interface UserPublic{
    id: string
    username: string
    image_file: string | null
    image_path: string
}
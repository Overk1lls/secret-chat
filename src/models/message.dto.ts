import { CurrentUserDTO } from "./current-user.dto";

export interface MessageDTO extends CurrentUserDTO {
    text: string;
}
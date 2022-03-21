import { Types } from "mongoose";
import { IMessage } from "../../models/message";

export interface IChatAggregation {
    _id: Types.ObjectId,
    messages?: IMessage[]
}

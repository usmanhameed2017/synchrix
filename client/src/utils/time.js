import moment from "moment";

export const getTime = (time) => {
    const msgDate = moment.utc(time).add(5, "hours");
    const today = moment();

    if(msgDate.isSame(today, "day")) return msgDate.format("h:mm a");
    return msgDate.format("DD MMM, h:mm a");
};
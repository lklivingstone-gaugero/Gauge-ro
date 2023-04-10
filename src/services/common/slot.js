class slot{
    async timeToSlot(slots){
        if(slots === "9am-12pm"){
            let str = "slota";
            return str;
        }
        if(slots === "12pm-3pm"){
            let str = "slotb";
            return str;
        }
        if(slots === "3pm-6pm"){
            let str = "slotc";
            return str;
        }
    }

    async slotToTime(slots){
        if(slots === "slota"){
            let str = "9am-12pm";
            return str;
        }
        if(slots === "slotb"){
            let str = "12pm-3pm";
            return str;
        }
        if(slots === "slotc"){
            let str = "3pm-6pm";
            return str;
        }
    }
}
export default new  slot();
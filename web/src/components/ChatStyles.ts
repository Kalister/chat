import { CSSProperties } from "react";

// TODO something like makeStyles (that is deprecated in new mui...)
const ChatStyles: Record<string, CSSProperties> = {
    vp: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    chatHistory: {
        height: 'calc(100% - 100px)',
        width: '100%',
        overflow: 'auto'
    },
    msg: {
        padding: 10,
        color: 'white',
        maxWidth: '50%',
        margin: 5,
        borderRadius: 10,
        display: 'inline-block',
        whiteSpace: 'pre-line'
    },
    myMsg: {
        textAlign: 'left',
        backgroundColor: 'blue',
    },
    myMsgLine: {
        textAlign: 'right',
    },
    otherMsg: {
        backgroundColor: 'gray',
    },
    msgLine: {
        textAlign: 'left',
    },
    msgPartUser: {
        fontSize: 10,
        fontWeight: 'bold',
        padding: 5
    },
    msgPartDate: {
        fontSize: 9,
        padding: 5,
        fontStyle: 'italic'
    },
    inputBlock: {
        display: 'flex',
        textAlign: 'center'
    },
    actions: {
        padding: 10
    },
    input: {
        flex: 1,
        resize: 'none',
        height: 50,
        margin: 10,
        padding: 5,
        borderRadius: 10
    },
    users: {
        fontSize: 10,
        padding: 10
    },
    error: {
        padding: 10,
        fontSize: 10,
        color: 'red'
    },
    btn: {
        backgroundColor: 'blue',
        color: 'white',
        margin: 2,
        borderRadius: 5
    },
    user: {
        padding: 3,
        margin: 2,
        backgroundColor: 'lime',
        borderRadius: 4,
    }
}

export default ChatStyles
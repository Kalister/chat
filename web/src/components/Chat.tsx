import { KeyboardEvent, createRef, useCallback, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";

import ChatStyles from "./ChatStyles";

interface Message {
    user: string
    message: string
    date: Date
}

interface ServerToClientEvents {
    message: (msg: Message) => void;
    users: (usrs: string[]) => void;
    user: (usr: string) => void;
    messages: (msgs: Message[]) => void;
}

interface ClientToServerEvents {
    message: (message: string) => void;
}

interface Props {

}

const ENDPOINT = "http://localhost:8000";

const styles = ChatStyles

const Chat = (props: Props) => {

    const chatHistoryRef = createRef<HTMLDivElement>()

    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<string[]>([])
    const [user, setUser] = useState<string>("")
    const [input, setInput] = useState<string>("")
    const [error, setError] = useState<string>("")

    const socket = useMemo((): Socket<ServerToClientEvents, ClientToServerEvents> => {
        const instance = io(ENDPOINT, {
            autoConnect: false
        })

        // console.log('initialized') // running twice
        return instance;
    }, [])

    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [socket])

    useEffect(() => {
        socket.on("message", (msg) => {
            setMessages([
                ...messages,
                msg
            ])
        })

        socket.on("messages", (msgs) => {
            setMessages(msgs)
        })

        socket.on("users", (usrs) => {
            setUsers(usrs)
        })

        socket.on("user", (usr) => {
            setUser(usr)
        })

    }, [socket, messages])

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
        }
    }, [messages, chatHistoryRef])

    useEffect(() => {
        setError("")
    }, [input])

    const sendMessage = useCallback(() => {
        if (input.trim()) {
            socket.emit("message", input);
            setInput("")
        } else {
            setError("No input")
        }
    }, [socket, input])

    const onKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (!e.ctrlKey) {
                sendMessage()
            } else {
                setInput(input + '\n')
            }
        }
    }, [sendMessage, setInput, input])

    const leave = useCallback(() => {
        socket.disconnect()
        setUsers([])
        setMessages([])
    }, [socket])

    const connect = useCallback(() => {
        socket.connect()
    }, [socket])

    return (
        <>
            <div style={styles.vp}>

                <div ref={chatHistoryRef} style={styles.chatHistory}>
                    {messages.map((m, k) => (
                        <div key={k} style={user === m.user ? styles.myMsgLine : styles.msgLine}>
                            <div style={{
                                ...styles.msg,
                                ...(user === m.user ? styles.myMsg : styles.otherMsg)
                            }}>
                                <div>{m.message}</div>
                                <span style={styles.msgPartUser}>{m.user}</span>
                                <span style={styles.msgPartDate}>{`at ${m.date}`}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.inputBlock}>
                    <textarea
                        style={styles.input}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={onKeyUp}
                    />
                    <div style={styles.actions}>

                        {socket.connected ?
                            <>
                                <button style={styles.btn} onClick={sendMessage}>send MSG</button>
                                <button style={{
                                    ...styles.btn,
                                    backgroundColor: 'red'
                                }} onClick={leave}>leave</button>
                            </>

                            : <button style={{
                                ...styles.btn,
                                backgroundColor: 'green'
                            }} onClick={connect}>connect</button>

                        } <br />

                        <div style={styles.users}>{users.map(u => <span style={{
                            ...styles.user,
                            fontWeight: u === user ? 'bold' : undefined
                        }}>{u}</span>)}</div>

                        <span style={styles.error}>{error}</span>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Chat
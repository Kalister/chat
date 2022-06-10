import { setUncaughtExceptionCaptureCallback } from "process";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
    user: string
    message: string
    date: Date
}

interface ServerToClientEvents {
    message: (msg: Message) => void;
    users: (usrs: string[]) => void;
    messages: (msgs: Message[]) => void;
}

interface ClientToServerEvents {
    message: (message: string) => void;
}

interface Props {

}

const ENDPOINT = "http://localhost:8000";

// const socket:Socket<ServerToClientEvents, ClientToServerEvents> = io(ENDPOINT)

const Chat = (props: Props) => {

    const socket = useMemo((): Socket<ServerToClientEvents, ClientToServerEvents> => {
        const instance = io(ENDPOINT, {
            autoConnect: false
        })
        console.log('initialized')
        return instance;
    }, [])

    // doesnt disconnect
    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [])

    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<string[]>([])
    const [input, setInput] = useState<string>("")

    useEffect(() => {

        console.log(new Date, socket)
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

    }, [socket, messages])

    const sendMessage = useCallback(() => {
        if (input) {
            socket.emit("message", input);
            setInput("")
            console.log('emited message')
        } else {
            console.log("no input")
        }
    }, [socket, input])

    const leave = useCallback(() => {
        // socket.close()
        socket.disconnect()
        setUsers([])
    }, [socket])

    const connect = useCallback(() => {
        // socket.close()
        socket.connect()
        // setUsers([])
    }, [socket])

    return (
        <>
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}>

                <div style={{  
                    height: 'calc(100% - 30px)', 
                    overflow:'auto'
                }}>
                    {messages.map((m, k) => (
                        <div key={k}>
                            <b>{m.user}:</b>
                            <span>{m.message}</span>
                            <div style={{ fontSize: 9 }}>{'on ' + m.date}</div>
                        </div>
                    ))}
                </div>

                <div style={{ height: 30 }}>
                    <input value={input} onChange={e => setInput(e.target.value)} />
                    <button onClick={sendMessage}>send MSG</button>
                    { socket.connected && <button onClick={leave}>leave</button> }
                    { !socket.connected && <button onClick={connect}>connect</button> }
                    <span>{users.join(', ')}</span>
                </div>

            </div>
        </>
    )
}

export default Chat
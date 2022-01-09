import PubNub from "pubnub"
import { v4 as uuidv4 } from "uuid"

const { REACT_APP_PUBNUB_PUBLISH_KEY, REACT_APP_PUBNUB_SECRET_KEY, REACT_APP_PUBNUB_SUBSCRIBE_KEY } = process.env

// get uuid from localStorage
let uuid = localStorage.getItem("uuid")
if(!uuid) {
  uuid = uuidv4()
  // store uuid in localStorage
  localStorage.setItem("uuid", uuid)
}

const initialize = () => {
  return new PubNub({
    publishKey: REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    secretKey: REACT_APP_PUBNUB_SECRET_KEY,
    uuid: uuid
  })
}

export const register = () => {
  return {
    pubnub: initialize(),
    uuid: uuid
  }
}
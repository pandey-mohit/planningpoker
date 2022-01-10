import PubNub from "pubnub"
import { v4 as uuidv4 } from "uuid"

const { REACT_APP_PUBNUB_PUBLISH_KEY, REACT_APP_PUBNUB_SECRET_KEY, REACT_APP_PUBNUB_SUBSCRIBE_KEY } = process.env

// get uuid from localStorage
const getUUID = (name) => {
  let uuid = localStorage.getItem("uuid")
  if(!uuid) {
    uuid = `${name}-${uuidv4()}`
    // store uuid in localStorage
    localStorage.setItem("uuid", uuid)
  }
  return uuid
}

const initialize = (name) => {
  return new PubNub({
    publishKey: REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    secretKey: REACT_APP_PUBNUB_SECRET_KEY,
    uuid: getUUID(name)
  })
}

export const register = (name) => {
  return {
    pubnub: initialize(name),
    uuid: localStorage.getItem("uuid")
  }
}
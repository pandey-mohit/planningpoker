import PubNub from "pubnub"
import { v4 as uuidv4 } from "uuid"

const { REACT_APP_PUBNUB_PUBLISH_KEY, REACT_APP_PUBNUB_SECRET_KEY, REACT_APP_PUBNUB_SUBSCRIBE_KEY } = process.env

// get uuid from localStorage
const getUUID = () => {
  let uuid = localStorage.getItem("uuid")
  if(!uuid) {
    uuid = uuidv4()
    // store uuid in localStorage
    localStorage.setItem("uuid", uuid)
  }
  return uuid
}

const initialize = (uuid) => {
  return new PubNub({
    publishKey: REACT_APP_PUBNUB_PUBLISH_KEY,
    subscribeKey: REACT_APP_PUBNUB_SUBSCRIBE_KEY,
    secretKey: REACT_APP_PUBNUB_SECRET_KEY,
    uuid: uuid
  })
}

// const uuidMetaData = async (pubnub, metadata) => {
//   if(!!metadata && (metadata.constructor === Object)) {
//     await pubnub.objects.setUUIDMetadata({ data: metadata })
//   }
//   const { status, data } = await pubnub.objects.getUUIDMetadata()
//   return status === 200 ? data : {}
// }

export const register = (participant, channelName) => {
  let uuid = getUUID(),
      pubnub = initialize(uuid)

  if(!!participant && (participant.constructor === Object)) {
    const { userName, enterAs } = participant
    pubnub.objects.setUUIDMetadata({
      data: {
        name: userName,
        custom: { enterAs }
      }
    })
  }

  if(channelName) {
    pubnub.subscribe({
      channels: [channelName]
    })
  }

  return {
    pubnub
  }
}

/**
 * CLEANUP JOB FOR PREVIOUS UUID
 */
(() => {
  let uuid = localStorage.getItem("uuid")
  if(uuid) {
    const arr = uuid.split("-")
    const name = arr.slice(0, arr.length - 5).join("-")
    if(name) {
      localStorage.removeItem("uuid")
      console.log("***** REMOVE STALE UUID *****")
    } else {
      console.log("***** NO STALE UUID FOUND *****")
    }
  }
})()
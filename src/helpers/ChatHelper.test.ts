/* tslint:disable:no-identical-functions */
import { create as createChat } from 'src/models/Chat'
import { create as createMessage } from 'src/models/Message'
import { sortChats } from 'src/helpers/ChatHelper'

it('sortsByTimestamp1', () => {
  const chats = [
    createChat({ chatId: 1, lastMsg: createMessage({ timestamp: 3 }) }),
    createChat({ chatId: 2, lastMsg: createMessage({ timestamp: 2 }) }),
    createChat({ chatId: 3, lastMsg: createMessage({ timestamp: 1 }) }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([1, 2, 3])
})

it('sortsByTimestamp2', () => {
  const chats = [
    createChat({ chatId: 3, lastMsg: createMessage({ timestamp: 1 }) }),
    createChat({ chatId: 2, lastMsg: createMessage({ timestamp: 2 }) }),
    createChat({ chatId: 1, lastMsg: createMessage({ timestamp: 3 }) }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([1, 2, 3])
})

it('sortsByTimestamp3', () => {
  const chats = [
    createChat({ chatId: 3, lastMsg: createMessage({ timestamp: 1 }) }),
    createChat({ chatId: 4 }),
    createChat({ chatId: 2, lastMsg: createMessage({ timestamp: 2 }) }),
    createChat({ chatId: 1, lastMsg: createMessage({ timestamp: 3 }) }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([1, 2, 3, 4])
})

it('sortsByAnswered1', () => {
  const chats = [
    createChat({ chatId: 1, isAnswered: true }),
    createChat({ chatId: 2, isAnswered: false }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([2, 1])
})

it('sortsByAnswered2', () => {
  const chats = [
    createChat({ chatId: 2, isAnswered: true }),
    createChat({ chatId: 1, isAnswered: false }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([1, 2])
})

it('sortsByArchived1', () => {
  const chats = [
    createChat({ chatId: 1, archived: true }),
    createChat({ chatId: 2, archived: false }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([2, 1])
})

it('sortsByArchived2', () => {
  const chats = [
    createChat({ chatId: 2, archived: true }),
    createChat({ chatId: 1, archived: false }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([1, 2])
})

it('sortsComplex1', () => {
  const chats = [
    createChat({ chatId: 9, isAnswered: true, archived: true }),
    createChat({ chatId: 8, isAnswered: false, archived: true }),
    createChat({ chatId: 7, isAnswered: true, lastMsg: createMessage({ timestamp: 3 }) }),
    createChat({ chatId: 6, isAnswered: false, lastMsg: createMessage({ timestamp: 2 }) }),
    createChat({ chatId: 5, isAnswered: true, lastMsg: createMessage({ timestamp: 1 }) }),
    createChat({ chatId: 4, isAnswered: false }), // not real case
    createChat({ chatId: 3, isAnswered: false }), // not real case
    createChat({ chatId: 2, isAnswered: true, lastMsg: null }),
    createChat({ chatId: 1, isAnswered: true, lastMsg: null }),
  ]
  const sortedIds = chats.sort(sortChats).map(i => i.chatId)
  expect(sortedIds).toEqual([6, 4, 3, 7, 5, 2, 1, 8, 9])
})

export {}

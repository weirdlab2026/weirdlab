import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('환경변수 MONGODB_URI가 설정되지 않았습니다.')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // 개발 중에는 새로고침(HMR) 시마다 연결이 늘어나지 않게 전역 변수에 저장
  let globalWithMongo = global

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 배포 환경(Vercel)에서는 표준 방식으로 연결
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
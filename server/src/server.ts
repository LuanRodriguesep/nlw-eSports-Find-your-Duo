import express from 'express';
import Cors from 'cors';

import {PrismaClient} from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-Hour-To-Minutes';
import { convertToMinutesToHourString } from './utils/convert-Minutes-To-Hour-String';

const app =  express()

app.use(express.json())
app.use(Cors()) // restringe acesso do frontend, normalmente definimos o front que fará o acesso, abrindo objeto e definindo na chave origin

const prisma = new PrismaClient({
  log: ['query']
})

const PORT = 3333

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  })
  return res.json(games);
});

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId: gameId,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })
  
  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertToMinutesToHourString(ad.hourStart),
      hourEnd: convertToMinutesToHourString(ad.hourEnd),
    }
  }))
})

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  })

  return res.json({
    discord: ad.discord
  })
})

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id
  const body: any = req.body

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
  }
  })

  return res.status(201).json(ad)
})

app.listen(`${PORT}`, () => {
  console.log(`Ouvindo na porta ${PORT}`);
})
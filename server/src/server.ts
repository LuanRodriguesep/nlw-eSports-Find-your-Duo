import express from 'express';

import {PrismaClient} from '@prisma/client'

const app =  express()

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
      weekDays: ad.weekDays.split(',')
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

app.post('games/:id/ads', async (req, res) => {
  const gameId = req.params.id
})

app.listen(`${PORT}`, () => {
  console.log(`Ouvindo na porta ${PORT}`);
})
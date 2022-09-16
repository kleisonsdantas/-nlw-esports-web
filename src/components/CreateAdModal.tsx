import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from 'phosphor-react';
import { Input } from './Form/Input';
import { FormEvent, useEffect, useState } from 'react';
import api from '../service/api';

interface GameResponse {
  id: string;
  title: string;
}

const daysOfWeek =[
  {
    value: "0",
    label: "D",
  },
  {
    value: "1",
    label: "S",
  },
  {
    value: "2",
    label: "T",
  },
  {
    value: "3",
    label: "Q",
  },
  {
    value: "4",
    label: "Q",
  },
  {
    value: "5",
    label: "S",
  },
  {
    value: "6",
    label: "S",
  },
]

export function CreateAdModal() {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData);

    if(!data.name) return;

    try {
      await api.post(`/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hoursStart: data.hoursStart,
        hoursEnd: data.hoursEnd,
        useVoiceChannel: useVoiceChannel
      });

      alert('Anúncio criado com sucesso!')
    } catch (error) {
      console.log(error);
      alert('Erro ao criar anúncio!')
    }
  }

  useEffect(() => {
    api.get('/games')
      .then(response => {
        setGames(response.data)
      })
  }, []);
  
  return (
  <Dialog.Portal>
    <Dialog.Overlay className='bg-black/60 inset-0 fixed'/>

    <Dialog.Content className='bg-[#2A2634] fixed py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[488px] shadow-lg shadow-black/25'>
      <Dialog.Title className='text-3xl text-white font-black'>Publique um anúncio</Dialog.Title>

      <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='game' className='font-semibold'>Qual o game?</label>
          <select 
            className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
            name='game' id='game'
            defaultValue=''
          >
            <option disabled >Selecione o game que desejar jogar</option>

            {games.map((game) => (
              <option key={game.id} value={game.id}>{game.title}</option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='name'>Seu nome ou (nickname)</label>
          <Input name='name' id='name' type='text' placeholder='Como te chamam dentro do jogo?'/>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='yearsPlaying'>Joga há quantos anos?</label>
            <Input name='yearsPlaying' id='yearsPlaying' type='number' placeholder='Tudo bem ser ZERO'/>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='discord'>Qual o seu Discord?</label>
            <Input name='discord' id='discord' type='text' placeholder='Usuário#0000'/>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='weekDays'>Quando costuma jogar?</label>

            <ToggleGroup.Root 
              className='grid grid-cols-4 gap-2'
              type='multiple'
              value={weekDays}
              onValueChange={setWeekDays}
            >
              {daysOfWeek.map((day)=> (
                <ToggleGroup.Item 
                  key={day.value}
                  value={day.value}
                  title='Domingo'
                  className={`w-8 h-8 rounded ${weekDays.includes(day.value) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  {day.label}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          <div className='flex flex-col gap-2 flex-1'>
            <label htmlFor='hoursStart'>Qual horário do dia?</label>
            <div className='flex gap-2'>
              <Input name='hoursStart' id='hoursStart' type='time' placeholder='De'/>
              <Input name='hoursEnd' id='hoursEnd' type='time' placeholder='Até'/>
            </div>
          </div>
        </div>

        <label className='mt-2 flex items-center gap-2 text-sm'>
          <Checkbox.Root 
            className='w-6 h-6 p-1 rounded bg-zinc-900'
            checked={useVoiceChannel}
            onCheckedChange={(checked) => setUseVoiceChannel(checked === true ? checked : false)}
          >
            <Checkbox.Indicator>
              <Check className='w-4 h-4 text-emerald-400'/>
            </Checkbox.Indicator>
          </Checkbox.Root>
          Costumo me conectar ao chat de voz
        </label>

        <footer className='mt-4 flex justify-end gap-4'>
          <Dialog.Close 
            type='button'
            className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
          >
            Cancelar
          </Dialog.Close>

          <button 
            type='submit'
            className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
          >
            <GameController size={24}/>
            Encontrar um Duo
          </button>
        </footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
  )
}
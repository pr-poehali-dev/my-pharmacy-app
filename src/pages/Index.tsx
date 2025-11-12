import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  category: string;
  dosage: string;
  frequency: string;
  time: string[];
  notes: string;
  image?: string;
  reminderEnabled: boolean;
}

interface Reminder {
  id: string;
  type: 'medicine' | 'doctor';
  title: string;
  date: Date;
  time: string;
  notes: string;
}

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Витамин D3',
      category: 'vitamins',
      dosage: '1000 МЕ',
      frequency: 'daily',
      time: ['09:00'],
      notes: 'Принимать во время еды',
      reminderEnabled: true,
    },
    {
      id: '2',
      name: 'Магний B6',
      category: 'vitamins',
      dosage: '2 таблетки',
      frequency: 'daily',
      time: ['20:00'],
      notes: 'Перед сном',
      reminderEnabled: true,
    },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      type: 'doctor',
      title: 'Прием у терапевта',
      date: new Date(2025, 10, 15),
      time: '14:30',
      notes: 'Принести результаты анализов',
    },
  ]);

  const categories = [
    { value: 'vitamins', label: 'Витамины', icon: 'Droplets', color: 'bg-green-100 text-green-700' },
    { value: 'antibiotics', label: 'Антибиотики', icon: 'Shield', color: 'bg-blue-100 text-blue-700' },
    { value: 'painkillers', label: 'Обезболивающие', icon: 'Heart', color: 'bg-red-100 text-red-700' },
    { value: 'other', label: 'Другое', icon: 'Pill', color: 'bg-purple-100 text-purple-700' },
  ];

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[3];
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddMedicine = () => {
    toast({
      title: 'Лекарство добавлено',
      description: 'Напоминание настроено успешно',
    });
    setImageUrl('');
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto p-4 pb-20 max-w-6xl">
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Pill" size={32} className="text-primary" />
              Моя Аптечка
            </h1>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={24} />
            </Button>
          </div>
          <p className="text-muted-foreground">Управляйте лекарствами и напоминаниями</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Календарь</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Icon name="Bell" size={18} />
              <span className="hidden sm:inline">Напоминания</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Icon name="Grid3x3" size={18} />
              <span className="hidden sm:inline">Категории</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Календарь приема</CardTitle>
                  <CardDescription>Выберите дату для просмотра расписания</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Сегодня</span>
                      <Badge variant="secondary">{medicines.length} лекарств</Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {medicines.map((medicine) => {
                      const categoryInfo = getCategoryInfo(medicine.category);
                      return (
                        <div key={medicine.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                          <div className={`p-2 rounded-full ${categoryInfo.color}`}>
                            <Icon name={categoryInfo.icon as any} size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">{medicine.dosage} • {medicine.time.join(', ')}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Icon name="Check" size={18} />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Icon name="Plus" size={20} className="mr-2" />
                      Добавить лекарство
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Новое лекарство</DialogTitle>
                      <DialogDescription>Добавьте информацию о лекарстве и настройте напоминания</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Название</Label>
                        <Input id="name" placeholder="Например: Аспирин" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Категория</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dosage">Дозировка</Label>
                        <Input id="dosage" placeholder="Например: 500 мг" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Время приема</Label>
                        <Input id="time" type="time" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Фото лекарства (URL)</Label>
                        <Input 
                          id="imageUrl" 
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                        />
                        {imagePreview && (
                          <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                            <img 
                              src={imagePreview} 
                              alt="Предпросмотр" 
                              className="w-full h-full object-cover"
                              onError={() => {
                                setImagePreview(null);
                                toast({
                                  title: 'Ошибка загрузки',
                                  description: 'Не удалось загрузить изображение по этой ссылке',
                                  variant: 'destructive',
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Заметки</Label>
                        <Textarea id="notes" placeholder="Дополнительная информация..." />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="reminder">Включить напоминания</Label>
                        <Switch id="reminder" defaultChecked />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddMedicine} className="w-full">Добавить</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Предстоящие напоминания</CardTitle>
                <CardDescription>Приемы врачей и важные напоминания</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div className={`p-3 rounded-full ${reminder.type === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      <Icon name={reminder.type === 'doctor' ? 'Stethoscope' : 'Bell'} size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{reminder.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reminder.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {reminder.time}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{reminder.notes}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Icon name="MoreVertical" size={18} />
                    </Button>
                  </div>
                ))}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Добавить напоминание к врачу
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новое напоминание</DialogTitle>
                      <DialogDescription>Запланируйте визит к врачу</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input placeholder="Например: Прием у кардиолога" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Дата</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>Время</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Заметки</Label>
                        <Textarea placeholder="Что взять с собой, адрес и т.д." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button className="w-full">Создать напоминание</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const categoryMedicines = medicines.filter(m => m.category === category.value);
                return (
                  <Card key={category.value} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2`}>
                        <Icon name={category.icon as any} size={24} />
                      </div>
                      <CardTitle className="text-lg">{category.label}</CardTitle>
                      <CardDescription>{categoryMedicines.length} лекарств</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryMedicines.slice(0, 3).map((med) => (
                          <div key={med.id} className="text-sm p-2 bg-muted rounded">
                            {med.name}
                          </div>
                        ))}
                        {categoryMedicines.length === 0 && (
                          <p className="text-sm text-muted-foreground">Нет лекарств</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Профиль</CardTitle>
                  <CardDescription>Ваша информация</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={32} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Пользователь</p>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Всего лекарств</span>
                      <span className="font-semibold">{medicines.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Активных напоминаний</span>
                      <span className="font-semibold">{medicines.filter(m => m.reminderEnabled).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Предстоящих визитов</span>
                      <span className="font-semibold">{reminders.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Настройки</CardTitle>
                  <CardDescription>Управление уведомлениями</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push-уведомления</p>
                      <p className="text-sm text-muted-foreground">Получать напоминания на устройство</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Звук</p>
                      <p className="text-sm text-muted-foreground">Звуковые оповещения</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Вибрация</p>
                      <p className="text-sm text-muted-foreground">Вибрация при напоминании</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Icon name="Download" size={18} className="mr-2" />
                      Экспортировать данные
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
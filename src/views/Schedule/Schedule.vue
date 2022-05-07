<template>
  <div>


    <v-container>
      <v-row  justify="center" class="mt-4">
        <h1>Ваше расписание </h1>
      </v-row>
      <div  >
        <v-sheet
          tile
          height="54"
          class="d-flex"
        >
          <v-btn
            icon
            class="ma-2"
            @click="calendarPrevPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <div class="d-flex align-center text-center">Недельный график
              <v-menu
                v-model="weekMenu"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    fab
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    outlined
                    style="border: none !important;"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-card style="max-width: 265px">
                  <v-form @submit.prevent="addWeekSchedule">
                  <v-card-text class="d-flex flex-column">
                    Рабочие дни недели
                    <div>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[0]" hide-details label="Понедельник"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[1]" hide-details label="Вторник"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[2]" hide-details label="Среда"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[3]" hide-details label="Четверг"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[4]" hide-details label="Пятница"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[5]" hide-details label="Суббота"></v-checkbox>
                    <v-checkbox class="ma-0" v-model="weekDaysHolder[6]" hide-details label="Воскресенье"></v-checkbox>
                    </div>
                    <div class="mt-2">
                    Дата начала графика
                    <DatePicker v-model="startWeekValue"></DatePicker>
                    </div>
                    <div class="mt-2">
                      Рабочее время
                      <div class="d-flex align-center justify-space-between">
                        <v-text-field
                          outlined
                          dense
                          v-model="durationWeekStart"
                          type="time"
                          hide-details

                          :rules="[(v) => !!v || 'Обязательное поле']"
                        ></v-text-field>
                        <span class="ml-2 mr-2">до</span>
                        <v-text-field
                          outlined
                          dense
                          v-model="durationWeekEnd"
                          hide-details
                          type="time"

                          :rules="[(v) => !!v || 'Обязательное поле']"
                        ></v-text-field>

                      </div>
                    </div>
                    <div v-if="timeWeekData.length !== 0" class="time-periods_block">
                      <div @click="deleteWeekPeriod(index)" class="time-period" :key="time" v-for="(time, index) in timeWeekData"> {{time}}</div>
                    </div>
                    <v-btn
                      class="mt-2"
                      style="color: white !important;"
                      color="success"
                      elevation="2"
                      @click="addWeekPeriod"
                      :disabled="!durationWeekStart || !durationWeekEnd"
                    >Добавить промежуток</v-btn>
                    <v-btn
                      class="mt-2"
                      style="color: white !important;"
                      color="#a60dbf"
                      elevation="2"
                      type="submit"
                      :disabled="timeWeekData.length === 0"
                    >Сохранить</v-btn>
                  </v-card-text>
                  </v-form>
                </v-card>
              </v-menu>
            </div>
          <div class="d-flex align-center text-center">Сменный график
            <v-menu
              v-model="sessionMenu"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              fab
              v-bind="attrs"
              v-on="on"
              x-small
              outlined
              style="border: none !important;"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
              </template>
              <v-card>
                <v-card-text class="d-flex flex-column">
                  Введите переодичность
                  <div class="d-flex align-center text-center">
                  <v-text-field  v-model="periodStart" style="width:36px" hide-details outlined dense></v-text-field>
                    <div class="ml-2 mr-2" style="vertical-align: middle !important">Через</div>
                  <v-text-field v-model="periodEnd" style="width:36px" hide-details outlined dense></v-text-field>
                  </div>
                  Выберите дату начала
                  <DatePicker v-model="startValue"></DatePicker>
                  Выберите рабочее время
                  <div class="d-flex align-center justify-space-between">
                  <v-text-field
                    outlined
                    dense
                    v-model="durationStart"
                    type="time"
                    hide-details

                    :rules="[(v) => !!v || 'Обязательное поле']"
                  ></v-text-field>
                    <span class="ml-2 mr-2">до</span>
                  <v-text-field
                    outlined
                    dense
                    v-model="durationEnd"
                    hide-details
                    type="time"

                    :rules="[(v) => !!v || 'Обязательное поле']"
                  ></v-text-field>
                  </div>
                  <div v-if="timeData.length !== 0" class="time-periods_block">
                    <div @click="deletePeriod(index)" class="time-period" :key="time" v-for="(time, index) in timeData"> {{time}}</div>
                  </div>
                  <v-btn
                    class="mt-2"
                    style="color: white !important;"
                    color="success"
                    elevation="2"
                    @click="addPeriod"
                    :disabled="!durationStart || !durationEnd"
                  >Добавить промежуток</v-btn>
                  <v-btn
                    class="mt-2"
                    style="color: white !important;"
                    color="#a60dbf"
                    elevation="2"
                    @click="addSchedule"
                  >Сохранить</v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>

          </div>

          <v-btn
            icon
            class="ma-2"
            @click="calendarNextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
           v-if="isLoading == false"
            ref="calendar"
            v-model="value"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="ru-RU"
           @click:day="editDay"

          >

            <template v-slot:day-label="{ day, date, month}">
              <div style="position: relative" v-if="value.split('-')[1] == month" >
                <div v-if="dataForEveryDay[date].working === true" style="background-color: #27AE60; color:white;">{{day}}

                </div>
                <div  v-if="dataForEveryDay[date].working === false" style=" color:black">{{day}}</div>
                <div  v-if="dataForEveryDay[date].start === true" title="Начало графика" style="top:0;position: absolute;background-color: #a60dbf; width: 16% !important;height: 100% !important;z-index: 1000"></div>
              </div>
            </template>
            <template v-slot:day="{date, month}">
              <div :key="dataForEveryDay[date].id" class="main-content" style="width: 100%; height: 100%" v-if="value.split('-')[1] == month" >
              <div style="font-size: 0.8rem; position: absolute" v-if="dataForEveryDay[date].ranges !== null">{{ dataForEveryDay[date].ranges[0] }}
              </div>
<div  class="edit-content">
  <div  class="edit-block_icon"></div>
</div>


              </div>
            </template>




          </v-calendar>
<div v-if="isLoading" style="height:100%" class="d-flex justify-center align-center">
          <v-progress-circular
            :size="70"
            :width="7"

            color="purple"
            indeterminate
          ></v-progress-circular>
</div>
          <v-dialog
            v-model="editDayHolder"
            width="500"
          >
            <v-card>
              <v-card-title style="color:white;background-color: #a60dbf">Редактирование дня</v-card-title>
              <v-form @submit.prevent="sendDateChanges">
              <v-card-text>
                <v-switch v-model="selectedDate.working" style="margin: 0" hide-details label="Рабочий день"></v-switch>
<!--                <div style="margin-top: 8px">-->
<!--                Время работы-->
<!--                <v-text-field style="width: fit-content" :disabled="!selectedDate.working" required hide-details outlined dense type="time"></v-text-field>-->
<!--                </div>-->
              </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="editDayHolder = false">Отмена</v-btn>
                  <v-btn type="submit" style="background-color:#a60dbf; color:white;">Сохранить</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-sheet>
      </div>

    </v-container>

    <v-snackbar
      v-model="snackbarHolder"
      :color="snackbarStatus"
    >
      {{ snackbarText }}
    </v-snackbar>

  </div>
</template>

<script>
import axiosInstance from "@/plugins/axios";
import DatePicker from "@/components/inputs/DatePicker";

export default {
  name: "Schedule",
  components:{DatePicker},
  data(){
    return{
      value:new Date().toISOString().split('T')[0] ,
      sessionMenu:false,
      startValue:'',
      startWeekValue:'',
      periodStart:null,
      periodEnd:null,
      isLoading:true,
      periodData:[],
      timeData:[],
      timeWeekData:[],
      calendarData:[],
      dataForEveryDay:{},
      durationStart:"09:00",
      durationEnd:"18:00",

      durationWeekStart:"09:00",
      durationWeekEnd:"18:00",

      weekMenu:false,
      snackbarText:'',
      snackbarHolder:false,
      snackbarStatus:null,
      editDayHolder:false,
      editDayElement:null,
      selectedOpen:false,
      selectedDate: {},

      weekDaysHolder:[false,false,false,false,false,false,false,]

    }
  },
  watch:{
    value(){
      this.fetchData()
    },
    weekDaysHolder(){
      console.log(this.weekDaysHolder)
    }

  },
  methods:{
    async deleteWeekPeriod(index){
   this.timeWeekData.splice(index,1)
      },
    async addWeekPeriod(){
      if (this.timeWeekData.includes(this.durationWeekStart + '-' + this.durationWeekEnd)){
        alert('Дубликат')
        return
      }
        this.timeWeekData.push(this.durationWeekStart + '-' + this.durationWeekEnd)
    },
    async addPeriod(){
      if (this.timeData.includes(this.durationStart + '-' + this.durationEnd)){
        alert('Дубликат')
        return
      }
      this.timeData.push(this.durationStart + '-' + this.durationEnd)
    },
    async deletePeriod(index){
      this.timeData.splice(index,1)
    },
    async sendDateChanges(){
     await axiosInstance.post('work_schedules/special_schedules/new/',this.selectedDate)
       .then((response)=>{
         this.dataForEveryDay[response.data.date.split('.').reverse().join('-')] = response.data
       })
      .catch((e)=>{
        console.error(e)
      })


    },
    editDay ({date}) {
      this.selectedDate =JSON.parse(JSON.stringify(this.dataForEveryDay[date])) //deep copy
      this.selectedDate = {...this.selectedDate, date: date.split('-').reverse().join('.')}
      this.editDayHolder = true
    },
    openSnackbar(status,text){
      this.snackbarText = text
      this.snackbarStatus = status
      this.snackbarHolder = true
    },
      calendarNextPage(){
       this.$refs.calendar.next()
    },
     calendarPrevPage(){
      this.$refs.calendar.prev()
    },
    async fetchData(){
      this.isLoading = true
      await axiosInstance.get(`work_schedules/schedules/actual/${this.value.split('-')[0]}/${this.value.split('-')[1]}/`)
        .then(  (response)=>{
          this.calendarData = response.data
          for (let i = 0; i < this.calendarData.length; i++){
            this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start , ranges: this.calendarData[i].ranges}
          }
        })
        .then(()=>{
          console.log(new Date(this.value))
        })
      .finally(()=>{
        this.isLoading = false
      })
    },


    calculatePeriodData(){
      this.periodData = []
      for (let i = 0; i < this.periodStart; i++){
        this.periodData.push(true)
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.periodData.push(false)
      }
    },
    calculateTimeData(){
      this.timeData = []
      for (let i = 0; i < this.periodStart; i++){
        this.timeData.push(`${this.durationStart}-${this.durationEnd}`)
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.timeData.push(null)
      }
    },
    calculateWeekTimeData(){
      this.timeWeekData = []
      for (let i = 0; i < this.periodStart; i++){
        this.timeWeekData.push([`${this.durationWeekStart}-${this.durationWeekEnd}`])
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.timeWeekData.push(null)
      }
    },

    async addWeekSchedule(){
      let timeResult = []
      for(let i = 0; i < this.weekDaysHolder.length; i++){
        if (this.weekDaysHolder[i] === true){
          timeResult.push(this.timeWeekData)
        } else {
          timeResult.push(null)
        }

      }

      await axiosInstance.post('work_schedules/schedules/new/',{
        start: this.startWeekValue,
        schedule_days: this.weekDaysHolder,
        schedule_time: timeResult
      })
        .then((response)=>{
          if (response.status === 200){
            this.openSnackbar('success', "Недельный график успешно создан!")
            this.weekMenu = false
            this.fetchData()
          }
          if (response.response.status === 400){
            this.openSnackbar('error', 'На эту дату график уже создан')
          }
        })
        .then((response)=>{
          if (response.status === 200){
            this.openSnackbar('success', "Сменный график успешно создан!")
            this.sessionMenu = false
            this.fetchData()
          }
          if (response.response.status === 400){
            this.openSnackbar('error', 'На эту дату график уже создан')
          }
        })
    },
    async addSchedule(){

      let timeResult = []
      for (let i = 0; i < this.periodStart; i++){
        timeResult.push(this.timeData)
      }
      for (let i = 0; i < this.periodEnd; i++){
        timeResult.push(null)
      }

      await this.calculatePeriodData()
      await axiosInstance.post('work_schedules/schedules/new/',{
        start: this.startValue,
        schedule_days: this.periodData,
        schedule_time: timeResult
      })
        .then((response)=>{
            if (response.status === 200){
              this.openSnackbar('success', "Сменный график успешно создан!")
              this.sessionMenu = false
              this.fetchData()
            }
            if (response.response.status === 400){
              this.openSnackbar('error', 'На эту дату график уже создан')
            }
        })
    },

  },
   mounted(){

    axiosInstance.get(`work_schedules/schedules/actual/${new Date().getFullYear()}/${new Date().getMonth() + 1}/`)
    .then(  (response)=>{
      this.calendarData = response.data
       for (let i = 0; i < this.calendarData.length; i++){
         this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start, ranges: this.calendarData[i].ranges}
       }

    })
      .then(()=>{
        this.isLoading = false
      })


    console.log(new Date(this.value))
  },
};
</script>

<style scoped>

.main-content{
  position: relative;
}
.edit-content{
  height: 80% !important;
  width: 100%;
  position: absolute;
  color: white !important;

}
.edit-content:hover{
  background-color: rgba(123, 123, 123, 0.1);
  height: 80% !important;
  width: 100%;
  position: absolute;
  cursor: pointer;
  color: gray;
}
.edit-content:hover .edit-icon{
  color: gray;
}

.edit-block_icon{
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-content: center;
  color: #a60dbf;
}
.edit-icon{
  color: white;
}
.v-input__slot{
  text-align: center !important;
  display: flex;
  justify-content: center;
}
.time-periods_block{
  margin-top: 0.5rem;
  max-width: 100%;
  max-height: 10rem;
  overflow-y: auto;
  background-color: #eaeaea;
  border: 1px solid rgba(157, 157, 157, 0.5);
  border-radius:4px ;
  display: flex;
  gap: 4px;
  flex-grow: 2;
  flex-wrap: wrap;
  padding: 4px;
}
.time-period{
  background-color: white;
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 3rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
}
.time-period:hover{
  background-color: #efefef;
  cursor: pointer;
  border: #ec0000 1px solid;
  border-radius: 4px;
}


</style>
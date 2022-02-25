<template>
  <div>


    <v-container>
      <v-row justify="center" class="mt-4">
        <h1>Ваше расписание </h1>
      </v-row>
      <div>
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
            <div class="d-flex align-center text-center">Неделньный график
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
                <v-card>
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
                  </v-card-text>
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
           :loading="isLoading === true"
            ref="calendar"
            v-model="value"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="ru-RU"

          >

            <template v-slot:day-label="{ day, date, month}">
              <div v-if="value.split('-')[1] == month" >
                <div v-if="dataForEveryDay[date].working === true" style="background-color: #27AE60; color:white">{{day}}</div>
                <div  v-if="dataForEveryDay[date].working === false" style=" color:black">{{day}}</div>
              </div>
            </template>
            <template v-slot:day="{date, month}">
              <div v-if="value.split('-')[1] == month" >
              <div style="font-size: 0.8rem" v-if="dataForEveryDay[date].ranges !== null">{{ dataForEveryDay[date].ranges[0] }}</div>
              </div>
            </template>



          </v-calendar>
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
      isLoading:false,
      periodData:[],
      timeData:[],
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
      await axiosInstance.get(`work_schedules/schedules/actual/${this.value.split('-')[0]}/${this.value.split('-')[1]}`)
        .then(  (response)=>{
          this.calendarData = response.data
          for (let i = 0; i < this.calendarData.length; i++){
            this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start , ranges: this.calendarData[i].ranges}
          }
        })
      .finally(()=>{
        this.isLoading = false
      })
    },

    calculateTimeData(){
      this.timeData = []
      for (let i = 0; i < this.periodStart; i++){
        this.timeData.push([`${this.durationStart}-${this.durationEnd}`])
      }
      for (let i = 0; i < this.periodEnd; i++){
        this.timeData.push(null)
      }
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
    async addSchedule(){
      await this.calculateTimeData()
      await this.calculatePeriodData()
      await axiosInstance.post('work_schedules/schedules/',{
        start: this.startValue,
        schedule_days: this.periodData,
        schedule_time: this.timeData
      })
        .then((response)=>{
            if (response.status === 201){
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
  async mounted(){
   this.isLoading = true
   await axiosInstance.get(`work_schedules/schedules/actual/${new Date().getFullYear()}/${new Date().getMonth() + 1}`)
    .then(  (response)=>{
      this.calendarData = response.data
       for (let i = 0; i < this.calendarData.length; i++){
         this.dataForEveryDay[this.calendarData[i].date.split('.').reverse().join('-')] = {working : this.calendarData[i].working, special : this.calendarData[i].special, start: this.calendarData[i].start, ranges: this.calendarData[i].ranges}
       }

    })

   this.isLoading = false

  },
};
</script>

<style scoped>

</style>
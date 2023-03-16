<template>
<div>
    <card
    :title="$t('docs.title')"
    :subTitle="$t('docs.subtitle')">

    <ul>
        <p class="text-success">{{$t('docs.pages')}}</p>
        <li class="text-danger">Dashboard</li>
        <p>{{$t('docs.dashboard')}}</p>

        <li class="text-danger">{{$t('sidebar.devices')}}</li>
        <p>{{$t('docs.devices')}}
        </p>

        <li class="text-danger">{{$t('sidebar.templates')}}</li>
        <p>{{$t('docs.templates')}}</p>
        <li class="text-danger">{{$t('sidebar.alarms')}}</li>
        <p>{{$t('docs.alarms')}}
        </p>
        <li class="text-danger">{{$t('sidebar.notifications')}}</li>
        <p>{{$t('docs.notifications')}}</p>
        <li class="text-danger">{{$t('sidebar.profile')}}</li>
        <p>
           {{$t('docs.profile')}}
        </p>
        <p class="text-success">{{$t('docs.howtouse')}}</p>
        <p>{{$t('docs.howtousetext')}}
        </p>
        
    </ul>
    </card>
</div>
</template>


<script>
import Card from '../../components/Cards/Card.vue'
export default {
  components: { Card },
  head: {
    title: 'IvcarIoT - Ayuda',
  },
    middleware:'authtenticated',
}
</script>
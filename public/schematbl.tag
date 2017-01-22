 <!-- RIOT TABLE -->
<schematbl>
<div class="card-panel teal">
  <ul class="collection with-header">
      <li class="collection-header"><h4>{ opts.name }</h4></li>
      <li class="collection-item" each={ fields }>{ title }<span class="badge">{ type }</span></li>
  </ul>
</div>

<script>
  this.fields = opts.fields;
</script>

</schematbl>
<!-- END TABLE -->
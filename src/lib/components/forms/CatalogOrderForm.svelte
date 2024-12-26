<script>
  import Button from '../Button.svelte'
</script>

<form name="katalog" method="POST" data-netlify="true">
  <div class="mt-8 max-w-md">
    <div class="grid grid-cols-1 gap-6">
      <label class="block">
        <span class="text-gray-700">Beställt antal kataloger</span>
        <input type="text" name="antal" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <label class="block">
        <span class="text-gray-700">Namn</span>
        <input
          type="text"
          name="namn"
          class="mt-1 block w-full rounded-md"
          placeholder="Ange för- och efternamn"
        />
      </label>
      <label class="block">
        <span class="text-gray-700">Adress</span>
        <input type="text" name="adress1" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <label class="block">
        <span class="text-gray-700">Adress 2</span>
        <input type="text" name="adress2" class="mt-1 block w-full rounded-md" placeholder="" />
      </label>
      <div class="flex gap-5">
        <label class="block">
          <span class="text-gray-700">Postnummer</span>
          <input
            type="text"
            name="postnummer"
            class="mt-1 block w-full rounded-md"
            placeholder=""
          />
        </label>
        <label class="block">
          <span class="text-gray-700">Ort</span>
          <input type="text" name="postort" class="mt-1 block w-full rounded-md" placeholder="" />
        </label>
      </div>
      <label class="block">
        <span class="text-gray-700">E-postadress</span>
        <input
          type="email"
          name="epostadress"
          class="mt-1 block w-full rounded-md"
          placeholder="namn@exempel.se"
        />
      </label>
      <p>
        <Button size="lg" type="submit">Beställ</Button>
      </p>
    </div>
  </div>
</form>

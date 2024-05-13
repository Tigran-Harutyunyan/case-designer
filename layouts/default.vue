<template>
  <Navbar />
  <main class="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
    <div class="flex-1 flex flex-col h-full">
      <slot />
    </div>
    <Footer />
  </main>
</template>

application: local {
  label: "Local"
  url: "http://localhost:8080/bundle.js"
  entitlements: {
    navigation: yes
    new_window: yes
    use_embeds: yes
    core_api_methods: ["run_look","all_boards","board","look"]
  }
}
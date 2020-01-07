Rails.application.routes.draw do

root 'games#index'
resources :games, only: [:index] do
  collection do
    get 'easy'
    get 'normal'
    get 'hard'
  end
end

end

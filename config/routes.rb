Rails.application.routes.draw do

root 'games#index'
resources :games, only: [:index, :new, :create, :show] do
  collection do
    get 'easy'
    get 'normal'
    get 'hard'
    get 'hell'
  end
end

end
